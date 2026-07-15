import { NextRequest, NextResponse } from "next/server";
import { getPasswordResetCallbackUrl } from "@/lib/auth/site-url";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  requestPasswordResetWithSupabase,
  type ForgotPasswordPayload,
} from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const SUCCESS_MESSAGE =
  "If an account exists for that email, we sent a password reset link.";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as ForgotPasswordPayload;
    const email = payload.email?.trim() ?? "";

    const supabase = await createClient();
    const result = await requestPasswordResetWithSupabase(
      supabase,
      email,
      await getPasswordResetCallbackUrl(request),
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
      message: SUCCESS_MESSAGE,
    });
  } catch (error) {
    logError(error, {
      context: "Auth Forgot Password API",
      meta: { url: "/api/auth/forgot-password", method: "POST", status: 500 },
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
