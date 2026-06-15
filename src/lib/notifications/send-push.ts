import { getFirebaseMessaging } from "@/lib/firebase/admin";
import { getFirebasePublicConfig, isFirebaseAdminConfigured } from "@/lib/firebase/config";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deletePushTokens,
  listEnabledPushTokensForUser,
} from "@/lib/supabase/push-tokens";
import { logError } from "@/lib/utils/logError";

export type PushSendResult = {
  success: boolean;
  successCount: number;
  failureCount: number;
  errors: Array<{ tokenPreview: string; code?: string; message?: string }>;
  skippedReason?: string;
};

function tokenPreview(token: string): string {
  if (token.length <= 16) return token;
  return `${token.slice(0, 8)}…${token.slice(-8)}`;
}

export type PushMessage = {
  title: string;
  body: string;
  data?: Record<string, string>;
  link?: string;
};

export async function sendPushToTokens(
  tokens: string[],
  message: PushMessage,
): Promise<PushSendResult> {
  if (!isFirebaseAdminConfigured()) {
    return {
      success: false,
      successCount: 0,
      failureCount: 0,
      errors: [],
      skippedReason: "FIREBASE_SERVICE_ACCOUNT_JSON is missing or invalid.",
    };
  }

  if (tokens.length === 0) {
    return {
      success: false,
      successCount: 0,
      failureCount: 0,
      errors: [],
      skippedReason: "No device tokens registered.",
    };
  }

  const messaging = getFirebaseMessaging();
  if (!messaging) {
    return {
      success: false,
      successCount: 0,
      failureCount: 0,
      errors: [],
      skippedReason:
        "Firebase Admin could not initialize. Check FIREBASE_SERVICE_ACCOUNT_JSON.",
    };
  }

  try {
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data,
      webpush: message.link
        ? {
            fcmOptions: {
              link: message.link,
            },
          }
        : undefined,
    });

    const errors = response.responses
      .map((result, index) => {
        if (result.success) return null;
        return {
          tokenPreview: tokenPreview(tokens[index] ?? ""),
          code: result.error?.code,
          message: result.error?.message,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const invalidTokens = response.responses
      .map((result, index) =>
        result.success ||
        result.error?.code !== "messaging/registration-token-not-registered"
          ? null
          : tokens[index],
      )
      .filter((token): token is string => Boolean(token));

    if (invalidTokens.length > 0) {
      const admin = createAdminClient();
      await deletePushTokens(admin, invalidTokens);
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[fcm] send result", {
        successCount: response.successCount,
        failureCount: response.failureCount,
        errors,
      });
    }

    return {
      success: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
      errors,
    };
  } catch (error) {
    logError(error, { context: "Send FCM push" });
    return {
      success: false,
      successCount: 0,
      failureCount: tokens.length,
      errors: [
        {
          tokenPreview: "all",
          message: error instanceof Error ? error.message : "Send failed.",
        },
      ],
    };
  }
}

export async function sendPushToUser(
  userId: string,
  message: PushMessage,
): Promise<PushSendResult> {
  const admin = createAdminClient();
  const tokens = await listEnabledPushTokensForUser(admin, userId);
  return sendPushToTokens(tokens, message);
}

export function getFirebasePushDiagnostics() {
  const publicConfig = getFirebasePublicConfig();
  const adminConfigured = isFirebaseAdminConfigured();
  const messaging = adminConfigured ? getFirebaseMessaging() : null;

  return {
    clientConfigured: publicConfig !== null,
    adminConfigured,
    adminReady: messaging !== null,
    clientProjectId: publicConfig?.projectId ?? null,
    messagingSenderId: publicConfig?.messagingSenderId ?? null,
    hasVapidKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim()),
  };
}
