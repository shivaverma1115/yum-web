import type { SupabaseClient } from "@supabase/supabase-js";
import { UserRole, type IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "../constants";
import { getProfileByUserId } from "./profile";

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
  }
  | {
    success: false;
    message: string;
    status: number;
    errors?: Record<string, string>;
  };

export async function loginWithSupabase(
  supabase: SupabaseClient,
  email: string,
  password: string,
): Promise<LoginResult> {
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

  const profile = await getProfileByUserId(supabase, data.user.id);

  if (!profile) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 500,
      errors: {},
    };
  }

  return {
    success: true,
    user: profile,
  };
}

export type RegisterResult =
  | {
    success: true;
    user: IUser;
    needsEmailConfirmation: boolean;
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
    return "Please verify your email. We sent a confirmation link to your inbox — check spam/junk if you don't see it.";
  }

  if (lower.includes("rate limit")) {
    return "Too many emails sent. Wait an hour, use custom SMTP in Supabase, or disable email confirmation for development.";
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
    country: "",
    state: "",
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
      "id, email, first_name, last_name, phone, country, state, zip_code, description, role, created_at, updated_at",
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
};

export type RegisterOptions = {
  adminClient: SupabaseClient;
  emailRedirectTo: string;
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: options.emailRedirectTo,
    },
  });

  if (error) {
    return {
      success: false,
      message: mapAuthErrorMessage(error.message),
      status: normalizeHttpStatus(error.status),
      errors: {},
    };
  }

  if (!data.user?.id) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  const identities = data.user.identities ?? [];
  if (identities.length === 0) {
    return {
      success: false,
      message:
        "This email is already registered. Sign in, or check your inbox for a confirmation link.",
      status: 400,
      errors: { email: "Email already in use." },
    };
  }

  const profileError = await upsertProfileWithAdmin(
    options.adminClient,
    data.user.id,
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

  const needsEmailConfirmation = !data.session;
  const profile =
    (await getProfileByUserId(supabase, data.user.id)) ??
    (await getProfileByUserIdAdmin(options.adminClient, data.user.id)) ??
    buildRegisterUserStub(data.user.id, email, "", "");

  return {
    success: true,
    user: profile,
    needsEmailConfirmation,
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
