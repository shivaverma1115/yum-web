import { NextResponse } from "next/server";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";
import { requireAuth } from "@/lib/auth/requireAuth";
import {
  enrichProfileFromAuthUser,
  profileFromAuthUser,
} from "@/lib/auth/user-metadata";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { getUserVerificationStatus } from "@/lib/auth/verification";

export async function GET() {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const user = auth.profile
      ? enrichProfileFromAuthUser(auth.profile, auth.user)
      : profileFromAuthUser(auth.user);

    return NextResponse.json({
      success: true,
      data: {
        user,
        verification: getUserVerificationStatus(auth.user),
        is_anonymous: isAnonymousUser(auth.user),
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
