import { NextResponse } from "next/server";
import { ensureAnonymousSessionWithSupabase } from "@/lib/auth/anonymous-session";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();
    const result = await ensureAnonymousSessionWithSupabase(supabase, admin);

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
      message: result.created
        ? "Guest checkout session started."
        : "Checkout session ready.",
      data: {
        user: result.user,
        is_anonymous: result.isAnonymous,
        created: result.created,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Auth Anonymous API",
      meta: { url: "/api/auth/anonymous", method: "POST", status: 500 },
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
