import type { UserVerificationStatus } from "@/types/user";
import { emailsMatch, isValidEmail, normalizeEmail } from "@/lib/email-otp/email";
import { isValidPhoneNumber, phonesMatch } from "@/lib/phone-otp/phone";

export function profileEmailNeedsVerification(
  email: string | null | undefined,
  savedEmail: string | null | undefined,
  verification: UserVerificationStatus | null,
  sessionVerified = false,
): boolean {
  const next = normalizeEmail(email);
  if (!next || !isValidEmail(next)) return false;
  if (sessionVerified) return false;
  if (emailsMatch(next, savedEmail) && verification?.email_verified) {
    return false;
  }
  return true;
}

export function profilePhoneNeedsVerification(
  phone: string | null | undefined,
  savedPhone: string | null | undefined,
  verification: UserVerificationStatus | null,
  sessionVerified = false,
): boolean {
  const next = phone?.trim() ?? "";
  if (!next) return false;
  if (!isValidPhoneNumber(next)) return false;
  if (sessionVerified) return false;
  if (phonesMatch(next, savedPhone) && verification?.phone_verified) {
    return false;
  }
  return true;
}
