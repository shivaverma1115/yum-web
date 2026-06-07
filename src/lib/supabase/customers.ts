import type { SupabaseClient } from "@supabase/supabase-js";
import { UserRole, type IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { deleteProductWithSupabase } from "@/lib/supabase/product/products";

const PROFILE_COLUMNS =
  "id, email, first_name, last_name, phone, country, state, zip_code, description, role, created_at, updated_at";

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

  // if (options.role) {
  //   query = query.eq("role", options.role);
  // }

  const search = options.search?.trim();
  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `email.ilike.${pattern},first_name.ilike.${pattern},last_name.ilike.${pattern},phone.ilike.${pattern}`,
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

export type CustomerAssociations = {
  orders: number;
  products: number;
};

export type DeleteCustomerResult =
  | { success: true }
  | {
      success: false;
      message: string;
      status: number;
      associations?: CustomerAssociations;
    };

export async function getCustomerAssociationsWithSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<CustomerAssociations | { error: string }> {
  const [ordersResult, productsResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  if (ordersResult.error) {
    return { error: ordersResult.error.message };
  }

  if (productsResult.error) {
    return { error: productsResult.error.message };
  }

  return {
    orders: ordersResult.count ?? 0,
    products: productsResult.count ?? 0,
  };
}

function buildDeleteBlockedMessage(associations: CustomerAssociations): string {
  const parts: string[] = [];

  if (associations.orders > 0) {
    parts.push(
      `${associations.orders} order${associations.orders === 1 ? "" : "s"}`,
    );
  }

  if (associations.products > 0) {
    parts.push(
      `${associations.products} product${associations.products === 1 ? "" : "s"}`,
    );
  }

  return `Cannot delete this customer. Please remove associated ${parts.join(" and ")} first, then delete the user.`;
}

export async function deleteCustomerWithSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<DeleteCustomerResult> {
  const customerResult = await getCustomerByIdWithSupabase(supabase, userId);

  if (!customerResult.success) {
    return {
      success: false,
      message: customerResult.message,
      status: customerResult.status,
    };
  }

  const associationsResult = await getCustomerAssociationsWithSupabase(
    supabase,
    userId,
  );

  if ("error" in associationsResult) {
    return {
      success: false,
      message: associationsResult.error,
      status: 400,
    };
  }

  if (associationsResult.orders > 0 || associationsResult.products > 0) {
    return {
      success: false,
      message: buildDeleteBlockedMessage(associationsResult),
      status: 409,
      associations: associationsResult,
    };
  }

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

async function collectCustomerOrderIds(
  supabase: SupabaseClient,
  userId: string,
  email?: string,
): Promise<{ orderIds: string[] } | { error: string }> {
  const orderIdSet = new Set<string>();

  const { data: ordersByUser, error: ordersByUserError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId);

  if (ordersByUserError) {
    return { error: ordersByUserError.message };
  }

  for (const row of ordersByUser ?? []) {
    if (row.id) orderIdSet.add(row.id);
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    const { data: ordersByEmail, error: ordersByEmailError } = await supabase
      .from("orders")
      .select("id")
      .eq("customer_email", trimmedEmail);

    if (ordersByEmailError) {
      return { error: ordersByEmailError.message };
    }

    for (const row of ordersByEmail ?? []) {
      if (row.id) orderIdSet.add(row.id);
    }
  }

  return { orderIds: Array.from(orderIdSet) };
}

export async function forceDeleteCustomerWithSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<DeleteCustomerResult> {
  const customerResult = await getCustomerByIdWithSupabase(supabase, userId);

  if (!customerResult.success) {
    return {
      success: false,
      message: customerResult.message,
      status: customerResult.status,
    };
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id")
    .eq("user_id", userId);

  if (productsError) {
    return {
      success: false,
      message: productsError.message,
      status: 400,
    };
  }

  for (const product of products ?? []) {
    if (!product.id) continue;

    const deleteProductResult = await deleteProductWithSupabase(
      supabase,
      product.id,
    );

    if (!deleteProductResult.success) {
      return {
        success: false,
        message: deleteProductResult.message,
        status: deleteProductResult.status,
      };
    }
  }

  const orderIdsResult = await collectCustomerOrderIds(
    supabase,
    userId,
    customerResult.user.email,
  );

  if ("error" in orderIdsResult) {
    return {
      success: false,
      message: orderIdsResult.error,
      status: 400,
    };
  }

  if (orderIdsResult.orderIds.length > 0) {
    const { error: deleteOrdersError } = await supabase
      .from("orders")
      .delete()
      .in("id", orderIdsResult.orderIds);

    if (deleteOrdersError) {
      return {
        success: false,
        message: deleteOrdersError.message,
        status: 400,
      };
    }
  }

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
  const first_name = input.first_name.trim();
  const last_name = input.last_name.trim();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      first_name,
      last_name,
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
