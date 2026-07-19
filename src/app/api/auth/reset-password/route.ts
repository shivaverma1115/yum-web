import { NextRequest, NextResponse } from "next/server";
import {
  clearPasswordRecoveryCookie,
  hasValidPasswordRecoverySession,
  PASSWORD_RECOVERY_COOKIE,
} from "@/lib/auth/recovery-session";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  updatePasswordWithSupabase,
  type ResetPasswordPayload,
} from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as ResetPasswordPayload;
    const password = payload.password ?? "";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reset link expired or invalid. Request a new password reset email.",
          errors: {},
        },
        { status: 401 },
      );
    }

    const recoveryToken = request.cookies.get(PASSWORD_RECOVERY_COOKIE)?.value;
    if (!hasValidPasswordRecoverySession(recoveryToken, user.id)) {
      const response = NextResponse.json(
        {
          success: false,
          message:
            "Password reset requires a valid recovery link. Open the link from your email, then set a new password.",
          errors: {},
        },
        { status: 403 },
      );
      clearPasswordRecoveryCookie(response);
      return response;
    }

    const result = await updatePasswordWithSupabase(supabase, password);

    const response = result.success
      ? NextResponse.json({
          success: true,
          message: "Password updated successfully. You can sign in now.",
        })
      : NextResponse.json(
          {
            success: false,
            message: result.message,
            errors: result.errors ?? {},
          },
          { status: result.status },
        );

    // One-time use: clear recovery marker after attempt (success or failure).
    clearPasswordRecoveryCookie(response);
    return response;
  } catch (error) {
    logError(error, {
      context: "Auth Reset Password API",
      meta: { url: "/api/auth/reset-password", method: "POST", status: 500 },
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
