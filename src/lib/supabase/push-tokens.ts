import type { SupabaseClient } from "@supabase/supabase-js";

export const PUSH_PLATFORMS = ["web", "ios", "android"] as const;
export type PushPlatform = (typeof PUSH_PLATFORMS)[number];

export type UserPushToken = {
  id: string;
  user_id: string;
  token: string;
  platform: PushPlatform;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type PushTokenRecord = {
  token: string;
  platform: PushPlatform;
};

export function normalizePushPlatform(
  value?: string | null,
): PushPlatform | null {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === "web" ||
    normalized === "ios" ||
    normalized === "android"
  ) {
    return normalized;
  }
  return null;
}

export async function listEnabledPushTokenRecordsForUser(
  supabase: SupabaseClient,
  userId: string,
  platform?: PushPlatform,
): Promise<PushTokenRecord[]> {
  let query = supabase
    .from("user_push_tokens")
    .select("token, platform")
    .eq("user_id", userId)
    .eq("enabled", true);

  if (platform) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return data
    .map((row) => {
      const token = row.token?.trim();
      const normalizedPlatform = normalizePushPlatform(row.platform);
      if (!token || !normalizedPlatform) return null;
      return { token, platform: normalizedPlatform };
    })
    .filter((record): record is PushTokenRecord => record !== null);
}

export async function listEnabledPushTokensForUser(
  supabase: SupabaseClient,
  userId: string,
  platform?: PushPlatform,
): Promise<string[]> {
  const records = await listEnabledPushTokenRecordsForUser(
    supabase,
    userId,
    platform,
  );
  return records.map((record) => record.token);
}

export async function upsertPushTokenForUser(
  supabase: SupabaseClient,
  userId: string,
  token: string,
  platform: PushPlatform = "web",
): Promise<{ success: true } | { success: false; message: string }> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { success: false, message: "Push token is required." };
  }

  const normalizedPlatform = normalizePushPlatform(platform);
  if (!normalizedPlatform) {
    return {
      success: false,
      message: "Platform must be one of: web, ios, android.",
    };
  }

  // One device token → one user: drop any other owner's row first.
  const { error: reclaimError } = await supabase
    .from("user_push_tokens")
    .delete()
    .eq("token", trimmed)
    .neq("user_id", userId);

  if (reclaimError) {
    return { success: false, message: reclaimError.message };
  }

  const { error } = await supabase.from("user_push_tokens").upsert(
    {
      user_id: userId,
      token: trimmed,
      platform: normalizedPlatform,
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
