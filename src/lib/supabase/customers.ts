import type { SupabaseClient } from "@supabase/supabase-js";
import { UserRole, type IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";

const PROFILE_COLUMNS =
  "id, email, full_name, first_name, last_name, user_name, phone, country, state, zip_code, description, role, created_at, updated_at";

export type ListCustomersResult =
  | {
      success: true;
      users: IUser[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  | {
      success: false;
      message: string;
      status: number;
    };

export type ListCustomersOptions = {
  role?: UserRole;
  page?: number;
  limit?: number;
  search?: string;
};

export async function listCustomersWithSupabase(
  supabase: SupabaseClient,
  options: ListCustomersOptions = {},
): Promise<ListCustomersResult> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 10));
  const offset = (page - 1) * limit;

  let query = supabase
    .from("profiles")
    .select(PROFILE_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false });

  if (options.role) {
    query = query.eq("role", options.role);
  }

  const search = options.search?.trim();
  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `email.ilike.${pattern},full_name.ilike.${pattern},phone.ilike.${pattern},user_name.ilike.${pattern}`,
    );
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return {
      success: false,
      message: error.message,
      status: 400,
    };
  }

  const total = count ?? 0;

  return {
    success: true,
    users: (data ?? []) as IUser[],
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export type GetCustomerResult =
  | { success: true; user: IUser }
  | {
      success: false;
      message: string;
      status: number;
    };

export async function getCustomerByIdWithSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<GetCustomerResult> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: error.message,
      status: 400,
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Customer not found.",
      status: 404,
    };
  }

  return {
    success: true,
    user: data as IUser,
  };
}

export type DeleteCustomerResult =
  | { success: true }
  | {
      success: false;
      message: string;
      status: number;
    };

export async function deleteCustomerWithSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<DeleteCustomerResult> {
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return {
      success: false,
      message: error.message,
      status: error.status ?? 400,
    };
  }

  return { success: true };
}

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
  input: IUser,
): Promise<CustomerMutationResult> {
  const email = input.email.trim();
  const fullName = `${input.first_name.trim()} ${input.last_name.trim()}`.trim();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
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
