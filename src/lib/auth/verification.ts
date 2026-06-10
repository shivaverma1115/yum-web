import type { User } from "@supabase/supabase-js";
import type { UserVerificationStatus } from "@/types/user";

const INTERNAL_EMAIL_DOMAINS = ["phone.yum.internal", "checkout.internal"];

export function isRealUserEmail(email?: string | null): boolean {
  const value = email?.trim();
  if (!value) return false;
  return !INTERNAL_EMAIL_DOMAINS.some((domain) => value.endsWith(`@${domain}`));
}

export function getUserVerificationStatus(authUser: User): UserVerificationStatus {
  const hasRealEmail = isRealUserEmail(authUser.email);
  const phoneVerifiedAt = authUser.phone_confirmed_at ?? null;
  const emailVerifiedAt = authUser.email_confirmed_at ?? null;

  return {
    phone_verified: Boolean(phoneVerifiedAt),
    phone_verified_at: phoneVerifiedAt,
    email_verified: hasRealEmail && Boolean(emailVerifiedAt),
    email_verified_at: hasRealEmail ? emailVerifiedAt : null,
  };
}
