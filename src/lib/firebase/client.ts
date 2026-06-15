import {
  getFirebasePublicConfig,
  getFirebaseVapidKey,
  isFirebaseClientConfigured,
} from "@/lib/firebase/config";

const SW_PATH = "/firebase-messaging-sw.js";

let swRegistrationPromise: Promise<ServiceWorkerRegistration | null> | null =
  null;

export type FcmTokenResult =
  | { ok: true; token: string }
  | { ok: false; reason: string };

async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (!swRegistrationPromise) {
    swRegistrationPromise = navigator.serviceWorker
      .register(SW_PATH, { scope: "/" })
      .then((registration) => {
        console.info("[fcm] service worker registered", SW_PATH);
        return registration;
      })
      .catch((error: unknown) => {
        console.error("[fcm] service worker registration failed", error);
        return null;
      });
  }

  return swRegistrationPromise;
}

export function isBrowserPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export async function requestFcmToken(): Promise<FcmTokenResult> {
  if (!isBrowserPushSupported()) {
    return { ok: false, reason: "This browser does not support push notifications." };
  }

  if (!isFirebaseClientConfigured()) {
    return {
      ok: false,
      reason: "Firebase client env vars are missing (NEXT_PUBLIC_FIREBASE_* and VAPID key).",
    };
  }

  const publicConfig = getFirebasePublicConfig();
  const vapidKey = getFirebaseVapidKey();
  if (!publicConfig || !vapidKey) {
    return { ok: false, reason: "Firebase client configuration is incomplete." };
  }

  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getMessaging, getToken, isSupported } = await import(
      "firebase/messaging"
    );

    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      return {
        ok: false,
        reason: "Firebase Messaging is not supported in this browser context.",
      };
    }

    const app =
      getApps().length > 0 ? getApps()[0]! : initializeApp(publicConfig);

    const registration = await registerMessagingServiceWorker();
    if (!registration) {
      return {
        ok: false,
        reason: `Could not register service worker at ${SW_PATH}. Open that URL in the browser and confirm it returns JavaScript.`,
      };
    }

    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      return { ok: false, reason: "Firebase returned an empty FCM token." };
    }

    console.info("[fcm] token obtained", {
      projectId: publicConfig.projectId,
      tokenPreview: `${token.slice(0, 12)}…`,
    });

    return { ok: true, token };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get FCM token.";

    console.error("[fcm] getToken failed", error);

    return {
      ok: false,
      reason: message,
    };
  }
}

export async function deleteFcmToken(): Promise<void> {
  if (!isFirebaseClientConfigured()) return;

  const publicConfig = getFirebasePublicConfig();
  if (!publicConfig) return;

  const { initializeApp, getApps } = await import("firebase/app");
  const { getMessaging, deleteToken, isSupported } = await import(
    "firebase/messaging"
  );

  const messagingSupported = await isSupported();
  if (!messagingSupported) return;

  const app =
    getApps().length > 0 ? getApps()[0]! : initializeApp(publicConfig);

  const messaging = getMessaging(app);
  await deleteToken(messaging).catch(() => undefined);
}
