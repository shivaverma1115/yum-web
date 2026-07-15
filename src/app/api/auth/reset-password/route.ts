import { NextRequest, NextResponse } from "next/server";
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
    const result = await updatePasswordWithSupabase(supabase, password);

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
      message: "Password updated successfully. You can sign in now.",
    });
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
