import { NextRequest, NextResponse } from "next/server";
import {
  getAuthMethodDisabledMessage,
  isEmailAuthEnabled,
} from "@/lib/business-settings/auth-methods";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  clearEmailVerifiedCookie,
  emailOtpRequiredResponse,
} from "@/lib/email-otp/request";
import { logError } from "@/lib/utils/logError";
import {
  registerWithSupabase,
  type RegisterPayload,
} from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const settings = await getCachedBusinessSettings();

    if (!isEmailAuthEnabled(settings)) {
      return NextResponse.json(
        {
          success: false,
          message: getAuthMethodDisabledMessage("email"),
        },
        { status: 403 },
      );
    }

    const payload: RegisterPayload = await request.json().catch(() => ({}));
    const email = payload.email?.trim() ?? "";

    const otpGate = emailOtpRequiredResponse(
      request,
      email,
      "Please verify your email with OTP before creating an account.",
    );
    if (otpGate) {
      return otpGate;
    }

    const supabase = await createClient();
    const adminClient = createAdminClient();
    const result = await registerWithSupabase(supabase, payload, {
      adminClient,
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

    const response = NextResponse.json({
      success: true,
      message: "Registered successfully.",
      data: {
        user: result.user,
      },
    });

    clearEmailVerifiedCookie(response);
    return response;
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
