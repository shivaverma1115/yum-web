"use client";

/**
 * Non-production banner + masked public env inspector.
 * Driven by NEXT_PUBLIC_APP_ENV (not NODE_ENV — Next forces that under `next dev`).
 * To remove later: delete this file and its import in app-providers.tsx.
 */

import { useEffect, useId, useMemo, useState } from "react";
import { X } from "lucide-react";
import { getAppEnv, shouldShowDevModeBanner } from "@/lib/app-env";

const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_VAPID_KEY",
] as const;

function maskValue(value: string, edge = 4): string {
  const trimmed = value.trim();
  if (!trimmed) return "(empty)";
  if (trimmed.length <= edge * 2) return "*".repeat(Math.min(trimmed.length, 8));
  return `${trimmed.slice(0, edge)}…${trimmed.slice(-edge)}`;
}

/** Show only the first N characters (for Supabase URL / anon key). */
function prefixValue(value: string, length = 10): string {
  const trimmed = value.trim();
  if (!trimmed) return "(empty)";
  if (trimmed.length <= length) return trimmed;
  return `${trimmed.slice(0, length)}…`;
}

function supabaseProjectRef(url: string): string {
  try {
    const host = new URL(url).hostname;
    const match = /^([a-z0-9-]+)\.supabase\.co$/i.exec(host);
    return match?.[1] ?? "(unknown)";
  } catch {
    return "(unknown)";
  }
}

function readPublicEnvRows() {
  const env: Record<string, string | undefined> = {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? getAppEnv(),
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  };

  const keys = ["NEXT_PUBLIC_APP_ENV", "NODE_ENV", ...PUBLIC_ENV_KEYS.slice(1)] as const;
  const supabaseKeys = new Set([
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]);

  return keys.map((key) => {
    const raw = env[key]?.trim() ?? "";
    return {
      key,
      value: !raw
        ? "(empty)"
        : supabaseKeys.has(key)
          ? prefixValue(raw, 10)
          : key === "NEXT_PUBLIC_APP_ENV" || key === "NODE_ENV"
            ? raw
            : maskValue(raw),
      set: Boolean(raw),
    };
  });
}

export default function DevelopmentModeBanner() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const appEnv = useMemo(() => getAppEnv(), []);
  const rows = useMemo(() => readPublicEnvRows(), []);
  const projectRef = useMemo(
    () => supabaseProjectRef(process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!shouldShowDevModeBanner()) {
    return null;
  }

  const bannerLabel =
    appEnv === "staging"
      ? "Staging mode — not production (click for env)"
      : "Development / test mode — not production (click for env)";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 bg-amber-500 px-3 py-1.5 text-center text-xs font-semibold tracking-wide text-amber-950 transition-colors hover:bg-amber-400"
        title="Click to inspect public env (masked)"
      >
        <span
          className="inline-block size-1.5 shrink-0 animate-pulse rounded-full bg-amber-950"
          aria-hidden
        />
        {bannerLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-lg border border-default-200 bg-white shadow-xl dark:bg-default-50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-default-200 px-4 py-3">
              <div>
                <h2
                  id={titleId}
                  className="text-sm font-semibold text-default-900"
                >
                  App env (public, masked)
                </h2>
                <p className="mt-0.5 text-xs text-default-500">
                  Banner uses NEXT_PUBLIC_APP_ENV (NODE_ENV stays{" "}
                  <span className="font-mono">{process.env.NODE_ENV}</span> under{" "}
                  <span className="font-mono">next dev</span>). Supabase URL/anon
                  show first 10 chars; others first/last 4. Project ref:{" "}
                  <span className="font-mono font-medium text-default-800">
                    {projectRef}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full text-default-500 hover:bg-default-100 hover:text-default-800"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="min-w-full divide-y divide-default-200 text-left text-xs">
                <thead className="bg-default-100">
                  <tr>
                    <th className="px-3 py-2 font-medium text-default-800">Key</th>
                    <th className="px-3 py-2 font-medium text-default-800">
                      Masked value
                    </th>
                    <th className="px-3 py-2 font-medium text-default-800">Set</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td className="px-3 py-2 font-mono text-default-800">
                        {row.key}
                      </td>
                      <td className="px-3 py-2 font-mono text-default-700">
                        {row.value}
                      </td>
                      <td className="px-3 py-2 text-default-600">
                        {row.set ? "yes" : "no"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
