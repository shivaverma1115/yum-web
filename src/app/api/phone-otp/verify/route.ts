import { NextRequest, NextResponse } from "next/server";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  getOtpDisabledMessage,
  getOtpProductionBlockedInDevMessage,
  isLocalTestOtpMode,
  isOtpEnabled,
  isProductionOtpBlockedInDev,
} from "@/lib/business-settings/phone-verification";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  PHONE_OTP_LENGTH,
  PHONE_OTP_PENDING_COOKIE,
} from "@/lib/phone-otp/constants";
import { LOCAL_TEST_OTP, matchesLocalTestOtp } from "@/lib/phone-otp/local-test";
import {
  isValidPhoneNumber,
  normalizePhoneE164,
} from "@/lib/phone-otp/phone";
import { verifySupabasePhoneOtp } from "@/lib/phone-otp/supabase-auth";
import { createVerifiedPhoneToken } from "@/lib/phone-otp/tokens";
import { logError } from "@/lib/utils/logError";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      phone?: string;
      otp?: string;
    };

    const phone = normalizePhoneE164(body.phone);
    const otp = body.otp?.trim() ?? "";

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

    if (!/^\d+$/.test(otp) || otp.length !== PHONE_OTP_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 6-digit OTP.",
          errors: { otp: "Invalid OTP." },
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

    if (isLocalTestOtpMode(mode)) {
      if (!matchesLocalTestOtp(otp)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid OTP. Use ${LOCAL_TEST_OTP} in local test mode.`,
            errors: { otp: `Use OTP ${LOCAL_TEST_OTP} in local test mode.` },
          },
          { status: 400 },
        );
      }

      const verified = createVerifiedPhoneToken(phone);
      const response = NextResponse.json({
        success: true,
        message: "Phone number verified.",
        data: { phone },
      });

      response.cookies.set(verified.cookieName, verified.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: verified.maxAge,
      });

      response.cookies.set(PHONE_OTP_PENDING_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    const result = await verifySupabasePhoneOtp(phone, otp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: { otp: result.message },
        },
        { status: result.status },
      );
    }

    const verified = createVerifiedPhoneToken(phone);
    const response = NextResponse.json({
      success: true,
      message: "Phone number verified.",
      data: { phone: result.phone },
    });

    response.cookies.set(verified.cookieName, verified.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: verified.maxAge,
    });

    response.cookies.set(PHONE_OTP_PENDING_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    logError(error, {
      context: "Phone OTP Verify API",
      meta: { url: "/api/phone-otp/verify", method: "POST", status: 500 },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
