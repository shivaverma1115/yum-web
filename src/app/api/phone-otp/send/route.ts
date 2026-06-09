import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { isValidPhoneNumber, normalizePhoneE164 } from "@/lib/phone-otp/phone";
import {
  createPendingOtpToken,
  generateOtpCode,
} from "@/lib/phone-otp/tokens";
import { sendPhoneOtpSms } from "@/lib/phone-otp/sms";
import { logError } from "@/lib/utils/logError";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { phone?: string };
    const phone = normalizePhoneE164(body.phone);

    if (!isValidPhoneNumber(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number.",
          errors: { phone: "Invalid phone number." },
        },
        { status: 400 },
      );
    }

    const otp = generateOtpCode();
    const pending = createPendingOtpToken(phone, otp);
    const sms = await sendPhoneOtpSms(phone, otp);

    if (!sms.sent) {
      return NextResponse.json(
        { success: false, message: sms.message },
        { status: 503 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "OTP sent to your phone.",
      data: {
        phone,
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
      context: "Phone OTP Send API",
      meta: { url: "/api/phone-otp/send", method: "POST", status: 500 },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
