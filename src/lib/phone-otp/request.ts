import type { NextRequest } from "next/server";
import {
  PHONE_OTP_PENDING_COOKIE,
  PHONE_OTP_VERIFIED_COOKIE,
} from "@/lib/phone-otp/constants";
import { phonesMatch } from "@/lib/phone-otp/phone";
import { readVerifiedPhoneToken } from "@/lib/phone-otp/tokens";

export function getVerifiedPhoneFromRequest(
  request: NextRequest,
): string | null {
  const token = request.cookies.get(PHONE_OTP_VERIFIED_COOKIE)?.value;
  const payload = readVerifiedPhoneToken(token);
  return payload?.phone ?? null;
}

export function isPhoneVerifiedOnRequest(
  request: NextRequest,
  phone: string,
): boolean {
  const verified = getVerifiedPhoneFromRequest(request);
  return phonesMatch(verified, phone);
}

export function clearPhoneOtpCookies() {
  return [
    { name: PHONE_OTP_PENDING_COOKIE, value: "", maxAge: 0 },
    { name: PHONE_OTP_VERIFIED_COOKIE, value: "", maxAge: 0 },
  ] as const;
}
