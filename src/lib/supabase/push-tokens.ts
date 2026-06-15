import type { SupabaseClient } from "@supabase/supabase-js";

export type UserPushToken = {
  id: string;
  user_id: string;
  token: string;
  platform: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export async function listEnabledPushTokensForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_push_tokens")
    .select("token")
    .eq("user_id", userId)
    .eq("enabled", true);

  if (error || !data) return [];

  return data
    .map((row) => row.token?.trim())
    .filter((token): token is string => Boolean(token));
}

export async function upsertPushTokenForUser(
  supabase: SupabaseClient,
  userId: string,
  token: string,
  platform = "web",
): Promise<{ success: true } | { success: false; message: string }> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { success: false, message: "Push token is required." };
  }

  const { error } = await supabase.from("user_push_tokens").upsert(
    {
      user_id: userId,
      token: trimmed,
      platform,
      enabled: true,
    },
    { onConflict: "user_id,token" },
  );

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function disablePushTokenForUser(
  supabase: SupabaseClient,
  userId: string,
  token: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { success: false, message: "Push token is required." };
  }

  const { error } = await supabase
    .from("user_push_tokens")
    .update({ enabled: false })
    .eq("user_id", userId)
    .eq("token", trimmed);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function countEnabledPushTokensForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("user_push_tokens")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("enabled", true);

  if (error) return 0;
  return count ?? 0;
}

export async function deletePushTokens(
  supabase: SupabaseClient,
  tokens: string[],
): Promise<void> {
  if (tokens.length === 0) return;

  await supabase.from("user_push_tokens").delete().in("token", tokens);
}
