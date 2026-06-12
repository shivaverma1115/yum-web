import { NextRequest, NextResponse } from "next/server";
import { getEmailConfirmRedirectUrl } from "@/lib/auth/site-url";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  registerWithSupabase,
  type RegisterPayload,
} from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { isOtpRequiredFor } from "@/lib/business-settings/phone-verification";
import { isPhoneVerifiedOnRequest } from "@/lib/phone-otp/request";
import { isValidPhoneNumber } from "@/lib/phone-otp/phone";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as RegisterPayload;
    const settings = await getCachedBusinessSettings();
    const phone = payload.phone?.trim() ?? "";

    if (isOtpRequiredFor(settings, "registration")) {
      if (!phone || !isValidPhoneNumber(phone)) {
        return NextResponse.json(
          {
            success: false,
            message: "A valid phone number is required.",
            errors: { phone: "Phone number is required." },
          },
          { status: 400 },
        );
      }

      if (!isPhoneVerifiedOnRequest(request, phone)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please verify your phone number with OTP before registering.",
            errors: { phone: "Phone verification required." },
          },
          { status: 403 },
        );
      }
    }

    const supabase = await createClient();
    const adminClient = createAdminClient();
    const result = await registerWithSupabase(supabase, payload, {
      adminClient,
      emailRedirectTo: await getEmailConfirmRedirectUrl(request),
    });

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
      message: result.needsEmailConfirmation
        ? "Account created. Check your email for the confirmation link."
        : "Registered successfully.",
      data: {
        user: result.user,
        needsEmailConfirmation: result.needsEmailConfirmation,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Auth Register API",
      meta: { url: "/api/auth/register", method: "POST", status: 500 },
    });
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
        errors: {},
      },
      { status: 500 },
    );
  }
}
