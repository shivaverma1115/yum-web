import type { NextRequest } from "next/server";
import { EMAIL_OTP_VERIFIED_COOKIE } from "@/lib/email-otp/constants";
import { emailsMatch } from "@/lib/email-otp/email";
import { readVerifiedEmailToken } from "@/lib/email-otp/tokens";

export function getVerifiedEmailFromRequest(
  request: NextRequest,
): string | null {
  const token = request.cookies.get(EMAIL_OTP_VERIFIED_COOKIE)?.value;
  const payload = readVerifiedEmailToken(token);
  return payload?.email ?? null;
}

export function isEmailVerifiedOnRequest(
  request: NextRequest,
  email: string,
): boolean {
  const verified = getVerifiedEmailFromRequest(request);
  return emailsMatch(verified, email);
}
