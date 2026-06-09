import { IUser } from "@/types/user";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<IUser | null> {
  const { data, error } = await supabase
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

export type CurrentUserSession = {
  authUser: User;
  user: IUser | null;
};

export type UpdateOwnProfileInput = Partial<
  Pick<
    IUser,
    "first_name" | "last_name" | "phone" | "zip_code" | "description"
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
  const updates: Record<string, string> = {};

  if (input.first_name !== undefined) {
    updates.first_name = (input.first_name ?? "").trim();
  }
  if (input.last_name !== undefined) {
    updates.last_name = (input.last_name ?? "").trim();
  }
  if (input.phone !== undefined) {
    updates.phone = (input.phone ?? "").trim();
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
