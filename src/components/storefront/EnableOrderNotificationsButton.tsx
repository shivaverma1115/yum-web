"use client";

import { Bell, BellOff, Loader2, Send } from "lucide-react";
import { useOrderNotifications } from "@/hooks/use-order-notifications";

export default function EnableOrderNotificationsButton() {
  const {
    supported,
    loading,
    busy,
    enabled,
    permission,
    diagnostics,
    enable,
    disable,
    sendTest,
  } = useOrderNotifications();

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-default-200 px-4 py-2 text-sm text-default-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Checking notifications…
      </div>
    );
  }

  if (!supported) {
    return (
      <p className="text-sm text-default-500">
        Push notifications are not available in this browser or are not configured
        yet.
      </p>
    );
  }

  if (permission === "denied") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Notifications are blocked in your browser settings. Allow notifications
        for this site, then try again.
      </div>
    );
  }

  if (diagnostics?.projectIdsMatch === false) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        Firebase project mismatch: client uses{" "}
        <strong>{diagnostics.clientProjectId}</strong> but the service account is
        for <strong>{diagnostics.adminProjectId}</strong>. Tokens from one
        project cannot receive messages sent from another.
      </div>
    );
  }

  if (diagnostics?.adminConfigured && !diagnostics.adminReady) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        Server cannot send push notifications:{" "}
        {diagnostics.adminParseError ??
          "invalid FIREBASE_SERVICE_ACCOUNT_JSON. Use FIREBASE_SERVICE_ACCOUNT_PATH with a JSON file instead."}
      </div>
    );
  }

  if (enabled) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void disable()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800 transition-colors hover:bg-green-100 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Bell className="h-4 w-4" aria-hidden />
          )}
          Notifications on
        </button>

        <button
          type="button"
          onClick={() => void sendTest()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-default-200 bg-white px-4 py-2 text-sm font-medium text-default-800 transition-colors hover:bg-default-50 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
          Send test
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void enable()}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full border border-default-200 bg-white px-4 py-2 text-sm font-medium text-default-800 transition-colors hover:bg-default-50 disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <BellOff className="h-4 w-4" aria-hidden />
      )}
      Enable order notifications
    </button>
  );
}
