import { NextRequest, NextResponse } from "next/server";
import {
  getAuthMethodDisabledMessage,
  isEmailAuthEnabled,
} from "@/lib/business-settings/auth-methods";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { verifyEmailPasswordCredentials } from "@/lib/supabase/auth";

/**
 * Validates email + password for login without creating a lasting session.
 * Used so OTP is only sent after credentials are correct.
 */
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

    const payload = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };

    const result = await verifyEmailPasswordCredentials(
      payload.email ?? "",
      payload.password ?? "",
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Credentials verified.",
    });
  } catch (error) {
    logError(error, {
      context: "Auth Verify Credentials API",
      meta: {
        url: "/api/auth/verify-credentials",
        method: "POST",
        status: 500,
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGE_GENERIC,
        errors: {},
      },
      { status: 500 },
    );
  }
}
