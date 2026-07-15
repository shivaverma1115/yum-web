import { IUser, UserRole } from "@/types/user";
import { profileEmailFromAuth } from "@/lib/auth/verification";
import { normalizeProfileContactPatch } from "@/lib/profile/sync-contact";
import { normalizeProfilePhone } from "@/lib/phone-otp/phone";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const PROFILE_COLUMNS =
  "id, email, first_name, last_name, phone, zip_code, description, role, created_at, updated_at";

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<IUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as IUser;
}

export async function getProfileByUserIdAdmin(
  admin: SupabaseClient,
  userId: string,
): Promise<IUser | null> {
  const { data, error } = await admin
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as IUser;
}

export async function ensureProfileForUserId(
  admin: SupabaseClient,
  userId: string,
  options?: { phone?: string; email?: string | null },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    return { ok: true };
  }

  const { data: authData, error: authError } =
    await admin.auth.admin.getUserById(userId);

  if (authError || !authData.user) {
    return {
      ok: false,
      message: authError?.message ?? "User not found.",
    };
  }

  const phone = options?.phone
    ? normalizeProfilePhone(options.phone)
    : authData.user.phone?.trim()
      ? normalizeProfilePhone(authData.user.phone)
      : "";

  const email =
    options?.email !== undefined
      ? profileEmailFromAuth(options.email)
      : profileEmailFromAuth(authData.user.email);

  const { error } = await admin.from("profiles").insert({
    id: userId,
    email,
    first_name: "",
    last_name: "",
    phone,
    role: UserRole.USER,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

export type CurrentUserSession = {
  authUser: User;
  user: IUser | null;
};

export type UpdateOwnProfileInput = Partial<
  Pick<
    IUser,
    "first_name" | "last_name" | "email" | "phone" | "zip_code" | "description"
  >
>;

export type UpdateOwnProfileResult =
  | { success: true; user: IUser }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

export async function updateOwnProfileWithSupabase(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateOwnProfileInput,
): Promise<UpdateOwnProfileResult> {
  const updates: Record<string, string | null> = {};

  if (input.first_name !== undefined) {
    updates.first_name = (input.first_name ?? "").trim();
  }
  if (input.last_name !== undefined) {
    updates.last_name = (input.last_name ?? "").trim();
  }
  const contactPatch = normalizeProfileContactPatch({
    ...(input.email !== undefined ? { email: input.email } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
  });

  if (input.email !== undefined) {
    updates.email = contactPatch.email ?? null;
  }
  if (input.phone !== undefined) {
    updates.phone = contactPatch.phone ?? "";
  }
  if (input.zip_code !== undefined) {
    updates.zip_code = (input.zip_code ?? "").trim();
  }
  if (input.description !== undefined) {
    updates.description = (input.description ?? "").trim();
  }

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      message: "No profile fields to update.",
      status: 400,
      errors: {},
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select(
      "id, email, first_name, last_name, phone, zip_code, description, role, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return {
        success: false,
        message: "This email is already registered to another account.",
        status: 409,
        errors: { email: "This email is already registered to another account." },
      };
    }

    return {
      success: false,
      message: error?.message ?? "Failed to update profile.",
      status: 400,
      errors: {},
    };
  }

  return {
    success: true,
    user: data as IUser,
  };
}

export async function getCurrentUser(
  supabase: SupabaseClient,
): Promise<CurrentUserSession | null> {
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  const profile = await getProfileByUserId(supabase, authUser.id);

  return {
    authUser,
    user: profile ?? null,
  };
}
