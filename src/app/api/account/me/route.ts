import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";

export async function GET() {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        authUser: auth.user,
        user: auth.profile,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Me API",
      meta: { url: "/api/account/me", method: "GET", status: 500 },
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
