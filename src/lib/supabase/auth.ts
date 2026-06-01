import type { SupabaseClient } from "@supabase/supabase-js";
import { UserRole, type IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "../constants";
import { getProfileByUserId } from "./profile";

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
      message: error.message,
      status: error.status ?? 400,
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

// Register with Supabase
export type RegisterPayload = Pick<IUser, "full_name" | "email"> & {
  password: string;
};

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

export async function registerWithSupabase(
  supabase: SupabaseClient,
  input: RegisterPayload
): Promise<RegisterResult> {

  const email = input.email.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.full_name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      status: error.status ?? 400,
      errors: {},
    };
  }

  if (!data.user) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email,
      full_name: input.full_name,
      role: UserRole.USER,
    },
    { onConflict: "id" },
  );

  // With email confirmation there may be no session yet; trigger still creates the row.
  if (profileError && data.session) {
    return {
      success: false,
      message: profileError.message,
      status: 400,
      errors: {},
    };
  }

  const needsEmailConfirmation = !data.session;
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
      status: error.status ?? 400,
    };
  }

  return { success: true };
}
