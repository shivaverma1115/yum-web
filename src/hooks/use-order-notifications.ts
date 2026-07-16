"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteFcmToken,
  getWebPushTokenIfGranted,
  isBrowserPushSupported,
  requestFcmToken,
  subscribeForegroundMessages,
} from "@/lib/firebase/client";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import { useContextApi } from "@/context-api/use-context";

type PushDiagnostics = {
  clientConfigured: boolean;
  adminConfigured: boolean;
  adminReady: boolean;
  clientProjectId: string | null;
  adminProjectId: string | null;
  messagingSenderId: string | null;
  hasVapidKey: boolean;
  adminParseError: string | null;
  projectIdsMatch: boolean | null;
};

type PushTokenState = {
  configured: boolean;
  enabled: boolean;
  tokenCount: number;
  diagnostics?: PushDiagnostics;
};

const INITIAL_STATE: PushTokenState = {
  configured: false,
  enabled: false,
  tokenCount: 0,
};

export function useOrderNotifications() {
  const { isAuthenticated, loading: authLoading } = useContextApi();
  const [state, setState] = useState<PushTokenState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const syncedTokenRef = useRef<string | null>(null);

  const registerTokenWithServer = useCallback(async (token: string) => {
    const response = await fetch("/api/account/push-tokens", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform: "web" }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || !data.success) {
      throw new Error(data.message ?? "Failed to register push token.");
    }

    return data;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      if (!isBrowserPushSupported()) {
        setPermission("unsupported");
        setState(INITIAL_STATE);
        syncedTokenRef.current = null;
        setCurrentToken(null);
        return;
      }

      setPermission(Notification.permission);

      if (!isAuthenticated) {
        setState(INITIAL_STATE);
        syncedTokenRef.current = null;
        setCurrentToken(null);
        return;
      }

      const response = await fetch("/api/account/push-tokens", {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        data?: PushTokenState;
      };

      if (response.ok && data.success && data.data) {
        setState(data.data);
        // Server says no tokens — clear local sync so we don't re-upsert.
        if (!data.data.enabled) {
          syncedTokenRef.current = null;
          setCurrentToken(null);
        }
      } else {
        setState(INITIAL_STATE);
        syncedTokenRef.current = null;
        setCurrentToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    if (
      loading ||
      authLoading ||
      !isAuthenticated ||
      !isBrowserPushSupported() ||
      !isFirebaseClientConfigured() ||
      permission !== "granted" ||
      !state.enabled
    ) {
      return;
    }

    void (async () => {
      const tokenResult = await getWebPushTokenIfGranted();
      if (!tokenResult.ok) return;

      if (syncedTokenRef.current === tokenResult.token) return;

      try {
        await registerTokenWithServer(tokenResult.token);
        syncedTokenRef.current = tokenResult.token;
        setCurrentToken(tokenResult.token);
      } catch (error) {
        console.warn("[fcm] token re-sync failed", error);
      }
    })();
  }, [
    loading,
    authLoading,
    isAuthenticated,
    permission,
    registerTokenWithServer,
    state.enabled,
  ]);

  useEffect(() => {
    if (
      !isBrowserPushSupported() ||
      !isFirebaseClientConfigured() ||
      permission !== "granted"
    ) {
      return;
    }

    let unsubscribe: () => void = () => {};

    void subscribeForegroundMessages((payload) => {
      const text = payload.body
        ? `${payload.title}: ${payload.body}`
        : payload.title;
      toast.info(text, { autoClose: 8000 });
    }).then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      unsubscribe();
    };
  }, [permission]);

  const enable = useCallback(async () => {
    if (!isBrowserPushSupported()) {
      toast.error("This browser does not support push notifications.");
      return;
    }

    if (!isFirebaseClientConfigured()) {
      toast.error("Push notifications are not configured yet.");
      return;
    }

    setBusy(true);

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        toast.error("Notification permission was not granted.");
        return;
      }

      const tokenResult = await requestFcmToken();
      if (!tokenResult.ok) {
        toast.error(tokenResult.reason);
        return;
      }

      const token = tokenResult.token;
      await registerTokenWithServer(token);

      syncedTokenRef.current = token;
      setCurrentToken(token);
      toast.success("Notifications enabled.");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to enable notifications.",
      );
    } finally {
      setBusy(false);
    }
  }, [refresh, registerTokenWithServer]);

  const disable = useCallback(async () => {
    if (!currentToken && !state.enabled) {
      toast.info("Notifications are already disabled on this device.");
      return;
    }

    setBusy(true);

    try {
      const tokenResult = currentToken
        ? { ok: true as const, token: currentToken }
        : await requestFcmToken();

      if (tokenResult.ok) {
        await fetch("/api/account/push-tokens", {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResult.token }),
        });

        await deleteFcmToken();
        syncedTokenRef.current = null;
        setCurrentToken(null);
      }

      toast.success("Notifications disabled for this device.");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to disable notifications.",
      );
    } finally {
      setBusy(false);
    }
  }, [currentToken, refresh, state.enabled]);

  const sendTest = useCallback(async () => {
    setBusy(true);

    try {
      const response = await fetch("/api/account/push-tokens/test", {
        method: "POST",
        credentials: "include",
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        data?: {
          result?: {
            errors?: Array<{ code?: string; message?: string }>;
          };
        };
      };

      if (!response.ok || !data.success) {
        const fcmError = data.data?.result?.errors?.[0];
        toast.error(
          fcmError?.message
            ? `${data.message ?? "Test failed."} (${fcmError.code ?? "fcm-error"})`
            : (data.message ?? "Test notification failed."),
        );
        return;
      }

      toast.success(
        data.message ??
          "Test notification sent. Check this page or your OS notification tray.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send test notification.",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    ...state,
    loading: loading || authLoading,
    busy,
    permission,
    supported: isBrowserPushSupported() && isFirebaseClientConfigured(),
    browserSupported: isBrowserPushSupported(),
    firebaseConfigured: isFirebaseClientConfigured(),
    enable,
    disable,
    sendTest,
    refresh,
  };
}
