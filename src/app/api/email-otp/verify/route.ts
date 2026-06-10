import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  EMAIL_OTP_LENGTH,
  EMAIL_OTP_PENDING_COOKIE,
} from "@/lib/email-otp/constants";
import { emailsMatch, isValidEmail, normalizeEmail } from "@/lib/email-otp/email";
import {
  createVerifiedEmailToken,
  emailOtpMatchesHash,
  readPendingEmailOtpToken,
} from "@/lib/email-otp/tokens";
import { logError } from "@/lib/utils/logError";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      otp?: string;
    };

    const email = normalizeEmail(body.email);
    const otp = body.otp?.trim() ?? "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
          errors: { email: "Invalid email address." },
        },
        { status: 400 },
      );
    }

    if (!/^\d+$/.test(otp) || otp.length !== EMAIL_OTP_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 6-digit OTP.",
          errors: { otp: "Invalid OTP." },
        },
        { status: 400 },
      );
    }

    const pendingToken = request.cookies.get(EMAIL_OTP_PENDING_COOKIE)?.value;
    const pending = readPendingEmailOtpToken(pendingToken);

    if (!pending || !emailsMatch(pending.email, email)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired or not requested. Please send a new OTP.",
          errors: { otp: "OTP session expired." },
        },
        { status: 400 },
      );
    }

    if (!emailOtpMatchesHash(otp, pending.otpHash)) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP. Please try again.",
          errors: { otp: "Incorrect OTP." },
        },
        { status: 400 },
      );
    }

    const verified = createVerifiedEmailToken(email);
    const response = NextResponse.json({
      success: true,
      message: "Email address verified.",
      data: { email },
    });

    response.cookies.set(verified.cookieName, verified.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: verified.maxAge,
    });

    response.cookies.set(EMAIL_OTP_PENDING_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    logError(error, {
      context: "Email OTP Verify API",
      meta: { url: "/api/email-otp/verify", method: "POST", status: 500 },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
