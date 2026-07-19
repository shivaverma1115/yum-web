import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";
import {
  getAnonymousUserId,
  mergeAnonymousUserIntoAccount,
  mergeSuccessMessage,
} from "@/lib/auth/anonymous-upgrade";
import { profileEmailFromAuth } from "@/lib/auth/verification";
import { getSupabasePublicEnv } from "@/lib/supabase/ssr-server";
import { UserRole, type IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC, MIN_PASSWORD_LENGTH, passwordMinLengthMessage } from "../constants";
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
      errors: mapCredentialFieldErrors(error.message),
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

  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Incorrect email or password.";
  }

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

/** Field errors for login credential failures (shown under inputs). */
export function mapCredentialFieldErrors(
  message: string,
): Record<string, string> {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return { password: "Incorrect email or password." };
  }

  if (lower.includes("email not confirmed")) {
    return { email: "Please verify your email before signing in." };
  }

  return { password: mapAuthErrorMessage(message) };
}

/**
 * Checks email + password without touching the browser session cookies.
 * Used so login OTP is only sent after credentials are valid.
 */
export async function verifyEmailPasswordCredentials(
  email: string,
  password: string,
): Promise<
  | { success: true }
  | {
      success: false;
      message: string;
      status: number;
      errors: Record<string, string>;
    }
> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    return {
      success: false,
      message: "Email and password are required.",
      status: 400,
      errors: {
        ...(!trimmedEmail ? { email: "Email is required." } : {}),
        ...(!password ? { password: "Password is required." } : {}),
      },
    };
  }

  const { url, anonKey } = getSupabasePublicEnv();
  const ephemeral = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { error } = await ephemeral.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    return {
      success: false,
      message: mapAuthErrorMessage(error.message),
      status: normalizeHttpStatus(error.status, 401),
      errors: mapCredentialFieldErrors(error.message),
    };
  }

  await ephemeral.auth.signOut({ scope: "local" });
  return { success: true };
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
  if (password && password.length < MIN_PASSWORD_LENGTH) {
    errors.password = passwordMinLengthMessage();
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

  let userId = created.user?.id ?? null;
  let sessionReady = false;

  if (createError || !userId) {
    const alreadyExists = /already|registered|exists/i.test(
      createError?.message ?? "",
    );
    if (!alreadyExists) {
      return {
        success: false,
        message: mapAuthErrorMessage(
          createError?.message ?? ERROR_MESSAGE_GENERIC,
        ),
        status: normalizeHttpStatus(createError?.status),
        errors: {},
      };
    }

    // Orphan Auth user (created earlier, profile missing): resume if password matches.
    const { error: resumeError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (resumeError) {
      return {
        success: false,
        message:
          "This email is already registered. Sign in or use forgot password.",
        status: 400,
        errors: { email: "Email already in use." },
      };
    }

    const {
      data: { user: resumed },
    } = await supabase.auth.getUser();
    if (!resumed?.id) {
      return {
        success: false,
        message: ERROR_MESSAGE_GENERIC,
        status: 400,
        errors: {},
      };
    }

    userId = resumed.id;
    sessionReady = true;
  }

  const phone = input.phone?.trim() ?? "";
  const createdFresh = Boolean(created.user?.id && created.user.id === userId);

  const profileError = await upsertProfileWithAdmin(
    options.adminClient,
    userId,
    email,
    "",
    "",
  );

  if (profileError) {
    if (createdFresh) {
      await options.adminClient.auth.admin.deleteUser(userId);
    }
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

  if (!sessionReady) {
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
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      message: passwordMinLengthMessage(),
      status: 400,
      errors: { password: passwordMinLengthMessage() },
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

  await supabase.auth.signOut({ scope: "global" });

  return { success: true };
}

export type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

export type ChangePasswordOptions = {
  /** When true, current password must be present and verified (email/password accounts). */
  requireCurrentPassword: boolean;
};

export async function changePasswordWithSupabase(
  supabase: SupabaseClient,
  email: string,
  input: ChangePasswordPayload,
  options: ChangePasswordOptions,
): Promise<ResetPasswordResult> {
  const currentPassword = input.currentPassword ?? "";
  const newPassword = input.newPassword ?? "";

  if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      message: passwordMinLengthMessage(),
      status: 400,
      errors: { newPassword: passwordMinLengthMessage() },
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

  if (options.requireCurrentPassword) {
    if (!currentPassword.trim()) {
      return {
        success: false,
        message: "Current password is required.",
        status: 400,
        errors: { currentPassword: "Current password is required." },
      };
    }

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
