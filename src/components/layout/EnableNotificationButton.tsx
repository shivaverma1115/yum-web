"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { useOrderNotifications } from "@/hooks/use-order-notifications";
import { useContextApi } from "@/context-api/use-context";

export default function EnableNotificationButton() {
  const { isAuthenticated, loading: authLoading } = useContextApi();
  const {
    supported,
    browserSupported,
    firebaseConfigured,
    loading,
    busy,
    enabled,
    permission,
    enable,
  } = useOrderNotifications();

  // Wait for auth + push status so we don't flash / hide incorrectly.
  if (authLoading || loading) {
    return null;
  }

  // Guests never get push tokens (API requires auth).
  if (!isAuthenticated) {
    return null;
  }

  // Already registered — hide the prompt.
  if (enabled) {
    return null;
  }

  if (!browserSupported) {
    return null;
  }

  if (!firebaseConfigured) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 border-b border-amber-300/60 bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-amber-950 sm:text-sm"
      >
        Push notifications are not configured (missing Firebase env vars).
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 border-b border-amber-300/60 bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-amber-950 sm:text-sm"
      >
        Notifications are blocked in your browser. Allow them for this site to
        receive updates.
      </div>
    );
  }

  if (!supported) {
    return null;
  }

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-center gap-2 border-b border-sky-300/50 bg-sky-600 px-3 py-2 text-white sm:gap-3"
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold sm:text-sm">
        <BellOff className="size-4 shrink-0" aria-hidden />
        Enable notifications to get live updates anytime
      </span>
      <button
        type="button"
        onClick={() => void enable()}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-50 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <Bell className="size-3.5" aria-hidden />
        )}
        {busy ? "Enabling…" : "Allow notifications"}
      </button>
    </div>
  );
}
