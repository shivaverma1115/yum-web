import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { sendPushToUser } from "@/lib/notifications/send-push";
import { logError } from "@/lib/utils/logError";

export async function POST() {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const result = await sendPushToUser(auth.user.id, {
      title: "Test notification",
      body: "If you see this, Yum order push notifications are working.",
      link: "/user/orders",
      data: {
        kind: "test",
        url: "/user/orders",
      },
    });

    if (result.skippedReason) {
      return NextResponse.json(
        {
          success: false,
          message: result.skippedReason,
          data: { result },
        },
        { status: 503 },
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.errors[0]?.message ??
            "FCM rejected the token. Re-enable notifications to get a fresh token.",
          data: { result },
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test notification sent. Check your browser/OS notification tray.",
      data: { result },
    });
  } catch (error) {
    logError(error, {
      context: "Account Push Tokens Test API",
      meta: { url: "/api/account/push-tokens/test", method: "POST", status: 500 },
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
