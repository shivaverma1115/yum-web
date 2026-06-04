import type { NextRequest } from "next/server";

/** Base URL for Supabase auth redirects (must be allow-listed in Supabase dashboard). */
export function getSiteUrl(request?: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return "http://localhost:3000";
}

export function getPasswordResetCallbackUrl(request?: NextRequest): string {
  const siteUrl = getSiteUrl(request);
  const next = encodeURIComponent("/reset-password");
  return `${siteUrl}/auth/callback?next=${next}`;
}

/** Where Supabase sends users after clicking the signup confirmation link. */
export function getEmailConfirmRedirectUrl(request?: NextRequest): string {
  const siteUrl = getSiteUrl(request);
  const next = encodeURIComponent("/login");
  return `${siteUrl}/auth/callback?next=${next}`;
}
