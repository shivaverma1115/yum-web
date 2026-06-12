import { NextRequest, NextResponse } from "next/server";
import { sendPhoneAuthOtp, sendPhoneAuthOtpLocal } from "@/lib/auth/phone-session";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  getOtpDisabledMessage,
  getOtpProductionBlockedInDevMessage,
  getOtpSendSuccessMessage,
  isLocalTestOtpMode,
  isOtpEnabled,
  isProductionOtpBlockedInDev,
} from "@/lib/business-settings/phone-verification";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { phone?: string };
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

    const result = isLocalTestOtpMode(mode)
      ? await sendPhoneAuthOtpLocal(body.phone ?? "")
      : await sendPhoneAuthOtp(await createClient(), body.phone ?? "");

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors ?? {},
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: getOtpSendSuccessMessage(mode),
      data: { phone: result.phone },
    });
  } catch (error) {
    logError(error, {
      context: "Auth Phone Send API",
      meta: { url: "/api/auth/phone/send", method: "POST", status: 500 },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
