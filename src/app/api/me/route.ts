import { NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const session = await getCurrentUser(supabase);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        authUser: session.authUser,
        user: session.user,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Me API",
      meta: { url: "/api/me", method: "GET", status: 500 },
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
