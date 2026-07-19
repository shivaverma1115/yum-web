import { NextResponse } from "next/server";
import {
  EMAIL_OTP_PENDING_COOKIE,
  EMAIL_OTP_VERIFIED_COOKIE,
} from "@/lib/email-otp/constants";
import {
  PHONE_OTP_PENDING_COOKIE,
  PHONE_OTP_VERIFIED_COOKIE,
} from "@/lib/phone-otp/constants";

const CLEARED = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

const OTP_COOKIE_NAMES = [
  EMAIL_OTP_PENDING_COOKIE,
  EMAIL_OTP_VERIFIED_COOKIE,
  PHONE_OTP_PENDING_COOKIE,
  PHONE_OTP_VERIFIED_COOKIE,
] as const;

/** Clears pending + verified email/phone OTP cookies (one-time use / logout). */
export function clearContactVerificationCookies(response: NextResponse) {
  for (const name of OTP_COOKIE_NAMES) {
    response.cookies.set(name, "", CLEARED);
  }
  return response;
}

export function clearEmailOtpCookies(response: NextResponse) {
  response.cookies.set(EMAIL_OTP_PENDING_COOKIE, "", CLEARED);
  response.cookies.set(EMAIL_OTP_VERIFIED_COOKIE, "", CLEARED);
  return response;
}

export function clearPhoneOtpCookiesOnResponse(response: NextResponse) {
  response.cookies.set(PHONE_OTP_PENDING_COOKIE, "", CLEARED);
  response.cookies.set(PHONE_OTP_VERIFIED_COOKIE, "", CLEARED);
  return response;
}
