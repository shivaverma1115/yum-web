import type { SupabaseClient } from "@supabase/supabase-js";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";
import {
  getAnonymousUserId,
  mergeAnonymousUserIntoAccount,
  mergeSuccessMessage,
} from "@/lib/auth/anonymous-upgrade";
import { profileEmailFromAuth } from "@/lib/auth/verification";
import { UserRole, type IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "../constants";
import { findProfileIdByEmail } from "./contact-lookup";
import { getProfileByUserId } from "./account/profile";

function normalizeHttpStatus(status: number | undefined, fallback = 400): number {
  if (typeof status === "number" && status >= 200 && status <= 599) {
    return status;
  }
  return fallback;
}

// Login with Supabase
export type LoginPayload = {
  email?: string;
  password?: string;
};

export type LoginResult =
  | {
    success: true;
    user: IUser;
    mergeMessage?: string | null;
  }
  | {
    success: false;
    message: string;
    status: number;
    errors?: Record<string, string>;
  };

export async function loginWithSupabase(
  supabase: SupabaseClient,
  adminClient: SupabaseClient,
  email: string,
  password: string,
): Promise<LoginResult> {
  const anonymousId = await getAnonymousUserId(supabase);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return {
      success: false,
      message: mapAuthErrorMessage(error.message),
      status: normalizeHttpStatus(error.status),
      errors: {},
    };
  }

  if (!data.user) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 401,
      errors: {},
    };
  }

  const profile: IUser | null = await getProfileByUserId(supabase, data.user.id);

  if (!profile) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 500,
      errors: {},
    };
  }

  let mergeMessage: string | null = null;
  if (anonymousId && anonymousId !== data.user.id) {
    const merge = await mergeAnonymousUserIntoAccount(
      adminClient,
      anonymousId,
      data.user.id,
    );
    mergeMessage = mergeSuccessMessage(merge);
  }

  return {
    success: true,
    user: profile,
    mergeMessage,
  };
}

export type RegisterResult =
  | {
    success: true;
    user: IUser;
  }
  | {
    success: false;
    message: string;
    status: number;
    errors?: Record<string, string>;
  };

export function mapAuthErrorMessage(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return "Please verify your email with the OTP sent to your inbox, then try again.";
  }

  if (lower.includes("rate limit")) {
    return "Too many emails sent. Please wait a bit and try again.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "This email is already registered. Sign in or use forgot password.";
  }
  return message;
}

function buildRegisterUserStub(
  userId: string,
  email: string,
  first_name: string,
  last_name: string,
): IUser {
  return {
    id: userId,
    email,
    first_name,
    last_name,
    phone: "",
    zip_code: "",
    description: "",
    role: UserRole.USER,
  };
}

async function upsertProfileWithAdmin(
  adminClient: SupabaseClient,
  userId: string,
  email: string,
  first_name: string,
  last_name: string,
): Promise<string | null> {
  const { error } = await adminClient.from("profiles").upsert(
    {
      id: userId,
      email,
      first_name,
      last_name,
      role: UserRole.USER,
    },
    { onConflict: "id" },
  );

  return error?.message ?? null;
}

async function getProfileByUserIdAdmin(
  adminClient: SupabaseClient,
  userId: string,
): Promise<IUser | null> {
  const { data, error } = await adminClient
    .from("profiles")
    .select(
      "id, email, first_name, last_name, phone, zip_code, description, role, created_at, updated_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as IUser;
}

export type RegisterPayload = Pick<IUser, "email"> & {
  password: string;
  phone?: string;
};

export type RegisterOptions = {
  adminClient: SupabaseClient;
};

export async function registerWithSupabase(
  supabase: SupabaseClient,
  input: RegisterPayload,
  options: RegisterOptions,
): Promise<RegisterResult> {
  const email = input.email?.trim() ?? "";
  const password = input.password ?? "";

  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";
  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below.",
      status: 400,
      errors,
    };
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser && isAnonymousUser(currentUser)) {
    const existingProfileId = await findProfileIdByEmail(
      options.adminClient,
      email,
    );

    if (existingProfileId && existingProfileId !== currentUser.id) {
      return {
        success: false,
        message:
          "This email is already registered. Sign in to link your guest orders to your account.",
        status: 400,
        errors: {
          email: "Email already in use. Sign in instead.",
        },
      };
    }

    const { error: updateError } = await options.adminClient.auth.admin.updateUserById(
      currentUser.id,
      {
        email,
        password,
        email_confirm: true,
      },
    );

    if (updateError) {
      return {
        success: false,
        message: mapAuthErrorMessage(updateError.message),
        status: normalizeHttpStatus(updateError.status),
        errors: {},
      };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        success: false,
        message: mapAuthErrorMessage(signInError.message),
        status: normalizeHttpStatus(signInError.status),
        errors: {},
      };
    }

    const profileError = await upsertProfileWithAdmin(
      options.adminClient,
      currentUser.id,
      profileEmailFromAuth(email) ?? email,
      "",
      "",
    );

    if (profileError) {
      return {
        success: false,
        message: profileError,
        status: 400,
        errors: {},
      };
    }

    const phone = input.phone?.trim() ?? "";
    if (phone) {
      const { error: phoneUpdateError } = await options.adminClient
        .from("profiles")
        .update({ phone })
        .eq("id", currentUser.id);

      if (phoneUpdateError) {
        return {
          success: false,
          message: phoneUpdateError.message,
          status: 400,
          errors: { phone: phoneUpdateError.message },
        };
      }
    }

    const profile =
      (await getProfileByUserId(supabase, currentUser.id)) ??
      (await getProfileByUserIdAdmin(options.adminClient, currentUser.id)) ??
      buildRegisterUserStub(currentUser.id, email, "", "");

    return {
      success: true,
      user: profile,
    };
  }

  const existingProfileId = await findProfileIdByEmail(
    options.adminClient,
    email,
  );

  if (existingProfileId) {
    return {
      success: false,
      message: "This email is already registered. Sign in or use forgot password.",
      status: 400,
      errors: { email: "Email already in use." },
    };
  }

  const { data: created, error: createError } =
    await options.adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    return {
      success: false,
      message: mapAuthErrorMessage(createError.message),
      status: normalizeHttpStatus(createError.status),
      errors: {},
    };
  }

  if (!created.user?.id) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  const userId = created.user.id;
  const phone = input.phone?.trim() ?? "";

  const profileError = await upsertProfileWithAdmin(
    options.adminClient,
    userId,
    email,
    "",
    "",
  );

  if (profileError) {
    return {
      success: false,
      message: profileError,
      status: 400,
      errors: {},
    };
  }

  if (phone) {
    const { error: phoneUpdateError } = await options.adminClient
      .from("profiles")
      .update({ phone })
      .eq("id", userId);

    if (phoneUpdateError) {
      return {
        success: false,
        message: phoneUpdateError.message,
        status: 400,
        errors: { phone: phoneUpdateError.message },
      };
    }
  }

  const anonymousId = await getAnonymousUserId(supabase);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      success: false,
      message: mapAuthErrorMessage(signInError.message),
      status: normalizeHttpStatus(signInError.status),
      errors: {},
    };
  }

  if (anonymousId && anonymousId !== userId) {
    await mergeAnonymousUserIntoAccount(
      options.adminClient,
      anonymousId,
      userId,
    );
  }

  const profile =
    (await getProfileByUserId(supabase, userId)) ??
    (await getProfileByUserIdAdmin(options.adminClient, userId)) ??
    buildRegisterUserStub(userId, email, "", "");

  return {
    success: true,
    user: profile,
  };
}

// Logout with Supabase
export type LogoutResult =
  | { success: true }
  | {
    success: false;
    message: string;
    status: number;
  };

export async function logoutWithSupabase(
  supabase: SupabaseClient,
): Promise<LogoutResult> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: error.message,
      status: normalizeHttpStatus(error.status),
    };
  }

  return { success: true };
}

// Forgot / reset password
export type ForgotPasswordPayload = {
  email?: string;
};

export type ForgotPasswordResult =
  | { success: true }
  | {
    success: false;
    message: string;
    status: number;
    errors?: Record<string, string>;
  };

export async function requestPasswordResetWithSupabase(
  supabase: SupabaseClient,
  email: string,
  redirectTo: string,
): Promise<ForgotPasswordResult> {
  const trimmed = email.trim();

  if (!trimmed) {
    return {
      success: false,
      message: "Email is required.",
      status: 400,
      errors: { email: "Email is required." },
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      status: normalizeHttpStatus(error.status),
      errors: {},
    };
  }

  return { success: true };
}

export type ResetPasswordPayload = {
  password?: string;
};

export type ResetPasswordResult =
  | { success: true }
  | {
    success: false;
    message: string;
    status: number;
    errors?: Record<string, string>;
  };

export async function updatePasswordWithSupabase(
  supabase: SupabaseClient,
  password: string,
): Promise<ResetPasswordResult> {
  if (!password || password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
      status: 400,
      errors: { password: "Password must be at least 6 characters." },
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "Reset link expired or invalid. Request a new password reset email.",
      status: 401,
      errors: {},
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      success: false,
      message: error.message,
      status: normalizeHttpStatus(error.status),
      errors: {},
    };
  }

  await supabase.auth.signOut();

  return { success: true };
}

export type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

export async function changePasswordWithSupabase(
  supabase: SupabaseClient,
  email: string,
  input: ChangePasswordPayload,
): Promise<ResetPasswordResult> {
  const currentPassword = input.currentPassword ?? "";
  const newPassword = input.newPassword ?? "";

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
      status: 400,
      errors: { newPassword: "Password must be at least 6 characters." },
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be signed in to change your password.",
      status: 401,
      errors: {},
    };
  }

  if (currentPassword.trim()) {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: currentPassword,
    });

    if (verifyError) {
      return {
        success: false,
        message: "Current password is incorrect.",
        status: 400,
        errors: { currentPassword: "Current password is incorrect." },
      };
    }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return {
      success: false,
      message: error.message,
      status: normalizeHttpStatus(error.status),
      errors: {},
    };
  }

  return { success: true };
}
