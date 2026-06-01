import { NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { logoutWithSupabase } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const result = await logoutWithSupabase(supabase);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Auth Logout API",
      meta: { url: "/api/auth/logout", method: "POST", status: 500 },
    });
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}
