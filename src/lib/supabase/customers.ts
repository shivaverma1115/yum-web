import type { SupabaseClient } from "@supabase/supabase-js";
import type { IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";

export type CustomerMutationResult =
  | { success: true; user: IUser }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

export async function createCustomerWithSupabase(
  supabase: SupabaseClient,
  input: IUser & { password: string },
): Promise<CustomerMutationResult> {
  const email = input.email.trim();
  const fullName = `${input.first_name.trim()} ${input.last_name.trim()}`.trim();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      user_name: input.user_name.trim(),
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", data.user.id)
    .select("*")
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      message: profileError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  return {
    success: true,
    user: profile as IUser,
  };
}

export async function updateCustomerWithSupabase(
  supabase: SupabaseClient,
  userId: string,
  input: IUser & { password?: string },
): Promise<CustomerMutationResult> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", userId)
    .select("*")
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      message: profileError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  if (input.password) {
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: input.password },
    );

    if (passwordError) {
      return {
        success: false,
        message: passwordError.message,
        status: passwordError.status ?? 400,
        errors: {},
      };
    }
  }

  if (input.email.trim() !== profile.email) {
    const { error: emailError } = await supabase.auth.admin.updateUserById(
      userId,
      { email: input.email.trim() },
    );

    if (emailError) {
      return {
        success: false,
        message: emailError.message,
        status: emailError.status ?? 400,
        errors: {},
      };
    }
  }

  return {
    success: true,
    user: profile as IUser,
  };
}
