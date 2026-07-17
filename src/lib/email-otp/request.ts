import { NextRequest, NextResponse } from "next/server";
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

/** Shared gate for login/register: OTP must be verified for this email. */
export function emailOtpRequiredResponse(
  request: NextRequest,
  email: string,
  message: string,
): NextResponse | null {
  if (isEmailVerifiedOnRequest(request, email)) {
    return null;
  }

  return NextResponse.json(
    {
      success: false,
      message,
      errors: { email: "Email verification required." },
    },
    { status: 403 },
  );
}

export function clearEmailVerifiedCookie(response: NextResponse): void {
  response.cookies.set(EMAIL_OTP_VERIFIED_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
