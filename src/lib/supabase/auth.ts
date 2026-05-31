import type { SupabaseClient } from "@supabase/supabase-js";
import type { IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "../constants";
import { getUserRole } from "./profile";

export type LoginPayload = {
  email?: string;
  password?: string;
};

export type LoginResult =
  | {
    success: true;
    user: { id: string; email: string | undefined; role: IUser["role"] };
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

  const role = await getUserRole(supabase, data.user.id);

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      role,
    },
  };
}

export type RegisterPayload = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | {
      success: true;
      user: { id: string; email: string | undefined; role: IUser["role"] };
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
  input: {
    fullName: string;
    email: string;
    password: string;
  },
): Promise<RegisterResult> {
  const email = input.email.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        user_name: input.fullName,
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
      full_name: input.fullName,
      role: "user",
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

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: "user",
    },
    needsEmailConfirmation,
  };
}
