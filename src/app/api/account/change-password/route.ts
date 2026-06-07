import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  changePasswordWithSupabase,
  type ChangePasswordPayload,
} from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json(
        { success: false, message: "You must be signed in to change your password." },
        { status: 401 },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as ChangePasswordPayload;
    const result = await changePasswordWithSupabase(supabase, user.email, payload);

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
      message: "Password updated successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Account Change Password API",
      meta: { url: "/api/account/change-password", method: "POST", status: 500 },
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
