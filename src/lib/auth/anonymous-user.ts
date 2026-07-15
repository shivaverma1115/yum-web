import type { User } from "@supabase/supabase-js";

export function isAnonymousUser(authUser: User): boolean {
  if (typeof authUser.is_anonymous === "boolean") {
    return authUser.is_anonymous;
  }

  const hasEmail = Boolean(authUser.email?.trim());
  const hasPhone = Boolean(authUser.phone?.trim());
  return !hasEmail && !hasPhone;
}
