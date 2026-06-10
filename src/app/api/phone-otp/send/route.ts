import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { isValidPhoneNumber, normalizePhoneE164 } from "@/lib/phone-otp/phone";
import { sendSupabasePhoneOtp } from "@/lib/phone-otp/supabase-auth";
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

    const result = await sendSupabasePhoneOtp(phone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const devHint =
      process.env.NODE_ENV === "development"
        ? " Use the test OTP configured in Supabase Dashboard → Auth → Phone."
        : "";

    return NextResponse.json({
      success: true,
      message: `OTP sent to your phone.${devHint}`,
      data: {
        phone: result.phone,
        expiresInSeconds: result.expiresInSeconds,
      },
    });
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
