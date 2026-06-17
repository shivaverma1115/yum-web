import type { MulticastMessage } from "firebase-admin/messaging";
import { getFirebaseMessaging } from "@/lib/firebase/admin";
import {
  getFirebasePublicConfig,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/config";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deletePushTokens,
  listEnabledPushTokenRecordsForUser,
  type PushPlatform,
  type PushTokenRecord,
} from "@/lib/supabase/push-tokens";
import { logError } from "@/lib/utils/logError";

export type PushSendResult = {
  success: boolean;
  successCount: number;
  failureCount: number;
  errors: Array<{ tokenPreview: string; code?: string; message?: string }>;
  skippedReason?: string;
};

const INVALID_FCM_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

function tokenPreview(token: string): string {
  if (token.length <= 16) return token;
  return `${token.slice(0, 8)}…${token.slice(-8)}`;
}

function isInvalidFcmToken(code?: string): boolean {
  return Boolean(code && INVALID_FCM_TOKEN_CODES.has(code));
}

function logPushResult(
  context: string,
  result: PushSendResult,
  meta?: Record<string, unknown>,
): void {
  console.info(`[fcm] ${context}`, {
    success: result.success,
    successCount: result.successCount,
    failureCount: result.failureCount,
    skippedReason: result.skippedReason,
    ...meta,
  });

  if (result.failureCount > 0 && result.errors.length > 0) {
    console.warn(`[fcm] ${context} errors`, result.errors);
  }
}

export type PushMessage = {
  title: string;
  body: string;
  data?: Record<string, string>;
  link?: string;
};

function buildPlatformMulticast(
  tokens: string[],
  platform: PushPlatform,
  message: PushMessage,
): MulticastMessage {
  const base: MulticastMessage = {
    tokens,
    notification: {
      title: message.title,
      body: message.body,
    },
    data: message.data,
  };

  if (platform === "web") {
    return {
      ...base,
      webpush: {
        notification: {
          icon: "/images/logo-light(1).png",
        },
        fcmOptions: message.link ? { link: message.link } : undefined,
      },
    };
  }

  if (platform === "android") {
    return {
      ...base,
      android: {
        priority: "high",
        notification: {
          channelId: "orders",
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
      },
    };
  }

  return {
    ...base,
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          alert: {
            title: message.title,
            body: message.body,
          },
          sound: "default",
          badge: 1,
        },
      },
    },
  };
}

function groupTokensByPlatform(
  records: PushTokenRecord[],
): Map<PushPlatform, string[]> {
  const grouped = new Map<PushPlatform, string[]>();

  for (const record of records) {
    const existing = grouped.get(record.platform) ?? [];
    existing.push(record.token);
    grouped.set(record.platform, existing);
  }

  return grouped;
}

export async function sendPushToTokenRecords(
  records: PushTokenRecord[],
  message: PushMessage,
  logContext = "send",
): Promise<PushSendResult> {
  if (!isFirebaseAdminConfigured()) {
    const result: PushSendResult = {
      success: false,
      successCount: 0,
      failureCount: 0,
      errors: [],
      skippedReason: "FIREBASE_SERVICE_ACCOUNT_JSON is missing or invalid.",
    };
    logPushResult(logContext, result);
    return result;
  }

  if (records.length === 0) {
    const result: PushSendResult = {
      success: false,
      successCount: 0,
      failureCount: 0,
      errors: [],
      skippedReason: "No device tokens registered.",
    };
    logPushResult(logContext, result);
    return result;
  }

  const messaging = getFirebaseMessaging();
  if (!messaging) {
    const result: PushSendResult = {
      success: false,
      successCount: 0,
      failureCount: 0,
      errors: [],
      skippedReason:
        "Firebase Admin could not initialize. Check FIREBASE_SERVICE_ACCOUNT_JSON.",
    };
    logPushResult(logContext, result);
    return result;
  }

  try {
    const grouped = groupTokensByPlatform(records);
    let successCount = 0;
    let failureCount = 0;
    const errors: PushSendResult["errors"] = [];
    const invalidTokens: string[] = [];

    for (const [platform, tokens] of grouped) {
      const response = await messaging.sendEachForMulticast(
        buildPlatformMulticast(tokens, platform, message),
      );

      successCount += response.successCount;
      failureCount += response.failureCount;

      response.responses.forEach((result, index) => {
        if (result.success) return;

        const token = tokens[index] ?? "";
        errors.push({
          tokenPreview: tokenPreview(token),
          code: result.error?.code,
          message: result.error?.message,
        });

        if (isInvalidFcmToken(result.error?.code)) {
          invalidTokens.push(token);
        }
      });
    }

    if (invalidTokens.length > 0) {
      const admin = createAdminClient();
      await deletePushTokens(admin, invalidTokens);
    }

    const result: PushSendResult = {
      success: successCount > 0,
      successCount,
      failureCount,
      errors,
    };

    logPushResult(logContext, result, {
      tokenCount: records.length,
      platforms: [...grouped.keys()],
      removedInvalidTokens: invalidTokens.length,
    });

    return result;
  } catch (error) {
    logError(error, { context: "Send FCM push" });
    const result: PushSendResult = {
      success: false,
      successCount: 0,
      failureCount: records.length,
      errors: [
        {
          tokenPreview: "all",
          message: error instanceof Error ? error.message : "Send failed.",
        },
      ],
    };
    logPushResult(logContext, result);
    return result;
  }
}

export async function sendPushToTokens(
  tokens: string[],
  message: PushMessage,
): Promise<PushSendResult> {
  const records = tokens.map((token) => ({
    token,
    platform: "web" as const,
  }));
  return sendPushToTokenRecords(records, message, "send-tokens");
}

export async function sendPushToUser(
  userId: string,
  message: PushMessage,
): Promise<PushSendResult> {
  const admin = createAdminClient();
  const records = await listEnabledPushTokenRecordsForUser(admin, userId);
  return sendPushToTokenRecords(records, message, "send-user");
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
