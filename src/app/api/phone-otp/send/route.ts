import { NextRequest, NextResponse } from "next/server";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  getOtpDisabledMessage,
  getOtpProductionBlockedInDevMessage,
  getOtpSendSuccessMessage,
  getLocalTestOtpBlockedInProductionMessage,
  isLocalTestOtpMode,
  isLocalTestOtpBlockedInProduction,
  isOtpEnabled,
  isProductionOtpBlockedInDev,
} from "@/lib/business-settings/phone-verification";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { getLocalTestOtpExpiresInSeconds } from "@/lib/phone-otp/local-test";
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

    const settings = await getCachedBusinessSettings();
    const mode = settings.phone_verification.mode;

    if (!isOtpEnabled(settings)) {
      return NextResponse.json(
        { success: false, message: getOtpDisabledMessage() },
        { status: 403 },
      );
    }

    if (isProductionOtpBlockedInDev(mode)) {
      return NextResponse.json(
        { success: false, message: getOtpProductionBlockedInDevMessage() },
        { status: 403 },
      );
    }

    if (isLocalTestOtpBlockedInProduction(mode)) {
      return NextResponse.json(
        { success: false, message: getLocalTestOtpBlockedInProductionMessage() },
        { status: 403 },
      );
    }

    if (isLocalTestOtpMode(mode)) {
      return NextResponse.json({
        success: true,
        message: getOtpSendSuccessMessage(mode),
        data: {
          phone,
          expiresInSeconds: getLocalTestOtpExpiresInSeconds(),
        },
      });
    }

    const result = await sendSupabasePhoneOtp(phone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: getOtpSendSuccessMessage(mode),
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
