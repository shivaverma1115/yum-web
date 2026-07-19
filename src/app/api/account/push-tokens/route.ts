import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import {
  getFirebaseAdminParseError,
  getFirebaseAdminProjectId,
} from "@/lib/firebase/admin";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { getFirebasePushDiagnostics } from "@/lib/notifications/send-push";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  countEnabledPushTokensForUser,
  disablePushTokenForUser,
  normalizePushPlatform,
  upsertPushTokenForUser,
} from "@/lib/supabase/push-tokens";
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

    const enabledCount = await countEnabledPushTokensForUser(
      auth.supabase,
      auth.user.id,
    );

    const diagnostics = getFirebasePushDiagnostics();
    const adminProjectId = getFirebaseAdminProjectId();
    const adminParseError = getFirebaseAdminParseError();
    const projectIdsMatch =
      diagnostics.clientProjectId && adminProjectId
        ? diagnostics.clientProjectId === adminProjectId
        : null;

    return NextResponse.json({
      success: true,
      data: {
        configured: isFirebaseClientConfigured(),
        enabled: enabledCount > 0,
        tokenCount: enabledCount,
        diagnostics: {
          ...diagnostics,
          adminProjectId,
          adminParseError:
            diagnostics.adminConfigured && !diagnostics.adminReady
              ? adminParseError
              : null,
          projectIdsMatch,
        },
      },
    });
  } catch (error) {
    logError(error, {
      context: "Account Push Tokens GET API",
      meta: { url: "/api/account/push-tokens", method: "GET", status: 500 },
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
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    if (!isFirebaseClientConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Push notifications are not configured on this site.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      token?: string;
      platform?: string;
    };

    const requestedPlatform = body.platform?.trim();
    const platform = requestedPlatform
      ? normalizePushPlatform(requestedPlatform)
      : "web";

    if (requestedPlatform && !platform) {
      return NextResponse.json(
        {
          success: false,
          message: "Platform must be one of: web, ios, android.",
        },
        { status: 400 },
      );
    }

    const result = await upsertPushTokenForUser(
      createAdminClient(),
      auth.user.id,
      body.token ?? "",
      platform ?? "web",
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifications enabled.",
    });
  } catch (error) {
    logError(error, {
      context: "Account Push Tokens POST API",
      meta: { url: "/api/account/push-tokens", method: "POST", status: 500 },
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

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      token?: string;
    };

    const result = await disablePushTokenForUser(
      auth.supabase,
      auth.user.id,
      body.token ?? "",
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifications disabled for this device.",
    });
  } catch (error) {
    logError(error, {
      context: "Account Push Tokens DELETE API",
      meta: { url: "/api/account/push-tokens", method: "DELETE", status: 500 },
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
