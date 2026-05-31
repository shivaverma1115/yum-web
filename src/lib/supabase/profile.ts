import type { SupabaseClient } from "@supabase/supabase-js";
import type { IUser } from "@/types/user";

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<IUser["role"]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!error && data?.role === "admin") {
    return "admin";
  }

  return "user";
}
