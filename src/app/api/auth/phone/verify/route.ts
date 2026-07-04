import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneAuthOtp } from "@/lib/auth/phone-session";
import {
  getAuthMethodDisabledMessage,
  isPhoneAuthEnabled,
} from "@/lib/business-settings/auth-methods";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  getOtpDisabledMessage,
  getOtpProductionBlockedInDevMessage,
  isProductionOtpBlockedInDev,
} from "@/lib/business-settings/phone-verification";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      phone?: string;
      otp?: string;
    };

    const settings = await getCachedBusinessSettings();
    const mode = settings.phone_verification.mode;

    if (!isPhoneAuthEnabled(settings)) {
      return NextResponse.json(
        {
          success: false,
          message: settings.auth.phone_login_register
            ? getOtpDisabledMessage()
            : getAuthMethodDisabledMessage("phone"),
        },
        { status: 403 },
      );
    }

    if (isProductionOtpBlockedInDev(mode)) {
      return NextResponse.json(
        { success: false, message: getOtpProductionBlockedInDevMessage() },
        { status: 403 },
      );
    }

    const result = await verifyPhoneAuthOtp(
      await createClient(),
      createAdminClient(),
      body.phone ?? "",
      body.otp ?? "",
      mode,
    );

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
      message: result.mergeMessage
        ? `${result.isNewUser ? "Account created successfully." : "Logged in successfully."} ${result.mergeMessage}`
        : result.isNewUser
          ? "Account created successfully."
          : "Logged in successfully.",
      data: {
        user: result.user,
        isNewUser: result.isNewUser,
        mergeMessage: result.mergeMessage ?? null,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Auth Phone Verify API",
      meta: { url: "/api/auth/phone/verify", method: "POST", status: 500 },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
