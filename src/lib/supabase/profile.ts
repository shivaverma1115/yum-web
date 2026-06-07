import { IUser } from "@/types/user";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<IUser | null> {
  const { data, error } = await supabase
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

export type CurrentUserSession = {
  authUser: User;
  user: IUser | null;
};

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
