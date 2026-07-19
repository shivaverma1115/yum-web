import type { SupabaseClient } from "@supabase/supabase-js";
import { enrichProfileFromAuthUser } from "@/lib/auth/user-metadata";
import { getUserVerificationStatus } from "@/lib/auth/verification";
import { normalizeEmail } from "@/lib/email-otp/email";
import { isValidPhoneNumber, normalizeProfilePhone } from "@/lib/phone-otp/phone";
import { mapAuthContactDuplicateError } from "@/lib/profile/contact-duplicate-errors";
import { assertContactAvailable } from "@/lib/profile/contact-uniqueness";
import {
  normalizeProfileContactPatch,
  runWithAuthContactFirst,
} from "@/lib/profile/sync-contact";
import { UserRole, type IUser, type IUserWithVerification } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { richTextToPlainText } from "@/lib/rich-text";
import { deleteProductWithSupabase } from "@/lib/supabase/product/products";

const PROFILE_COLUMNS =
  "id, email, first_name, last_name, phone, zip_code, description, role, created_at, updated_at";

async function attachVerification(
  supabase: SupabaseClient,
  user: IUser,
): Promise<IUserWithVerification> {
  if (!user.id) {
    return {
      ...user,
      verification: {
        phone_verified: false,
        phone_verified_at: null,
        email_verified: false,
        email_verified_at: null,
      },
    };
  }

  const { data, error } = await supabase.auth.admin.getUserById(user.id);
  if (error || !data.user) {
    return {
      ...user,
      verification: {
        phone_verified: false,
        phone_verified_at: null,
        email_verified: false,
        email_verified_at: null,
      },
    };
  }

  return {
    ...enrichProfileFromAuthUser(user, data.user),
    verification: getUserVerificationStatus(data.user),
  };
}

export type ListCustomersResult =
  | {
      success: true;
      users: IUserWithVerification[];
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
  const profiles = (data ?? []) as IUser[];
  const users = await Promise.all(
    profiles.map((profile) => attachVerification(supabase, profile)),
  );

  return {
    success: true,
    users,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export type GetCustomerResult =
  | { success: true; user: IUserWithVerification }
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

  const user = await attachVerification(supabase, data as IUser);

  return {
    success: true,
    user,
  };
}

export type DeleteCustomerResult =
  | { success: true }
  | {
      success: false;
      message: string;
      status: number;
    };

/**
 * Permanently deletes a customer and all user-owned data:
 * products (+ storage images), profile, addresses,
 * push tokens, coupon redemptions. Orders are retained (user_id set null).
 * Table QR codes are restaurant-wide and are left alone.
 */
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

  // Orders are retained (user_id nullified by FK on auth delete).
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
  const email = input.email?.trim() ? normalizeEmail(input.email) : "";
  const phone = input.phone?.trim() ? normalizeProfilePhone(input.phone) : "";

  if (!email && !isValidPhoneNumber(phone)) {
    return {
      success: false,
      message: "Email or phone number is required.",
      status: 400,
      errors: {
        email: "Provide an email or phone number.",
        phone: "Provide an email or phone number.",
      },
    };
  }

  const first_name = input.first_name.trim();
  const last_name = input.last_name.trim();

  const contactConflict = await assertContactAvailable(supabase, {
    email: email || undefined,
    phone: phone || undefined,
  });

  if (!contactConflict.ok) {
    return {
      success: false,
      message: contactConflict.message,
      status: contactConflict.status,
      errors: contactConflict.errors,
    };
  }

  const { data, error } = email
    ? await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        phone: phone || undefined,
        phone_confirm: phone ? true : undefined,
        user_metadata: {
          first_name,
          last_name,
        },
      })
    : await supabase.auth.admin.createUser({
        phone,
        phone_confirm: true,
        user_metadata: {
          first_name,
          last_name,
        },
      });

  if (error) {
    const duplicate = mapAuthContactDuplicateError(error.message, {
      email,
      phone: input.phone,
    });
    if (duplicate) {
      return {
        success: false,
        message: duplicate.message,
        status: duplicate.status,
        errors: duplicate.errors,
      };
    }

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

  const profilePatch = {
    ...input,
    email: email || null,
    phone: phone || input.phone?.trim() || "",
  };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update(profilePatch)
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
  const contactConflict = await assertContactAvailable(
    supabase,
    {
      email: input.email,
      phone: input.phone,
    },
    userId,
  );

  if (!contactConflict.ok) {
    return {
      success: false,
      message: contactConflict.message,
      status: contactConflict.status,
      errors: contactConflict.errors,
    };
  }

  const { data: previousProfile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  const profilePatch = {
    ...input,
    ...normalizeProfileContactPatch({
      email: input.email,
      phone: input.phone,
    }),
    ...(input.description !== undefined
      ? { description: richTextToPlainText(input.description).trim() }
      : {}),
  };

  const synced = await runWithAuthContactFirst(
    supabase,
    userId,
    {
      mode: "admin",
      previousProfile: (previousProfile as IUser | null) ?? null,
      nextEmail: normalizeEmail(profilePatch.email),
      nextPhone: profilePatch.phone?.trim() ?? "",
    },
    async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .update(profilePatch)
        .eq("id", userId)
        .select("*")
        .single();

      if (profileError || !profile) {
        if (profileError?.code === "23505") {
          return {
            success: false as const,
            message: "This email is already registered to another account.",
            status: 409,
            errors: {
              email: "This email is already registered to another account.",
            } satisfies Record<string, string>,
          };
        }

        return {
          success: false as const,
          message: profileError?.message ?? ERROR_MESSAGE_GENERIC,
          status: 400,
        };
      }

      return { success: true as const, data: profile as IUser };
    },
  );

  if (!synced.success) {
    return {
      success: false,
      message: synced.message,
      status: synced.status,
      errors: synced.errors ?? {},
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

  return {
    success: true,
    user: synced.data,
  };
}
