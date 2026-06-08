import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  updateOwnProfileWithSupabase,
  type UpdateOwnProfileInput,
} from "@/lib/supabase/account/profile";
import type { IUser } from "@/types/user";

/** Logged-in user updates their own profile (no admin check). */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as Partial<IUser>;

    const result = await updateOwnProfileWithSupabase(
      auth.supabase,
      auth.user.id,
      payload as UpdateOwnProfileInput,
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
      message: "Profile updated successfully.",
      data: { user: result.user },
    });
  } catch (error) {
    logError(error, {
      context: "Account Update Profile API",
      meta: { url: "/api/account/customers", method: "PATCH", status: 500 },
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
