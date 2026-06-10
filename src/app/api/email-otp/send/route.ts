import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { isValidEmail, normalizeEmail } from "@/lib/email-otp/email";
import { sendEmailOtpMessage } from "@/lib/email-otp/delivery";
import {
  createPendingEmailOtpToken,
  generateEmailOtpCode,
} from "@/lib/email-otp/tokens";
import { logError } from "@/lib/utils/logError";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: string };
    const email = normalizeEmail(body.email);

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

    const otp = generateEmailOtpCode();
    const pending = createPendingEmailOtpToken(email, otp);
    const delivery = await sendEmailOtpMessage(email, otp);

    if (!delivery.sent) {
      return NextResponse.json(
        { success: false, message: delivery.message },
        { status: 503 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
      data: {
        email,
        expiresInSeconds: pending.maxAge,
        ...(process.env.NODE_ENV === "development"
          ? { debugOtp: otp }
          : {}),
      },
    });

    response.cookies.set(pending.cookieName, pending.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: pending.maxAge,
    });

    return response;
  } catch (error) {
    logError(error, {
      context: "Email OTP Send API",
      meta: { url: "/api/email-otp/send", method: "POST", status: 500 },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
