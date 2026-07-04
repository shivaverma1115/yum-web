import { NextResponse } from "next/server";
import {
  clearAnonymousMergeCookie,
  setAnonymousMergeCookie,
} from "@/lib/auth/anonymous-upgrade";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";

/**
 * Stores the current anonymous user id so OAuth / external login can merge guest orders.
 */
export async function POST() {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const response = NextResponse.json({ success: true });

    if (!isAnonymousUser(auth.user)) {
      clearAnonymousMergeCookie(response);
      return response;
    }

    setAnonymousMergeCookie(response, auth.user.id);
    return response;
  } catch (error) {
    logError(error, {
      context: "Anonymous Prepare Merge API",
      meta: {
        url: "/api/auth/anonymous/prepare-merge",
        method: "POST",
        status: 500,
      },
    });
    return NextResponse.json(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
