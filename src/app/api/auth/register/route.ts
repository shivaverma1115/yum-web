import { NextRequest, NextResponse } from "next/server";
import { getAuthMethodDisabledMessage, isEmailAuthEnabled } from "@/lib/business-settings/auth-methods";
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
