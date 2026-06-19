import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  changePasswordWithSupabase,
  type ChangePasswordPayload,
} from "@/lib/supabase/auth";

function shouldRequireCurrentPassword(
  providers: string[] | undefined,
): boolean {
  const normalized = (providers ?? []).map((provider) => provider.toLowerCase());
  // OAuth-only accounts (e.g. google) can set a password for the first time.
  if (normalized.length > 0 && !normalized.includes("email")) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const auth = await requireAuth({ requireEmail: true });

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const providers = (auth.user.app_metadata?.providers ?? []) as string[];
    const requireCurrentPassword = shouldRequireCurrentPassword(providers);

    return NextResponse.json({
      success: true,
      data: {
        requireCurrentPassword,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Account Change Password Status API",
      meta: { url: "/api/account/change-password", method: "GET", status: 500 },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth({ requireEmail: true });

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as ChangePasswordPayload;
    const result = await changePasswordWithSupabase(
      auth.supabase,
      auth.user.email!,
      payload,
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
