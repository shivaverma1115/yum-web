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
  return `${siteUrl}/auth/confirm?next=${encodeURIComponent("/reset-password")}`;
}

/** Used by signUp; confirmation emails use token_hash templates (Supabase Dashboard → Email Templates). */
export function getEmailConfirmRedirectUrl(request?: NextRequest): string {
  const siteUrl = getSiteUrl(request);
  return `${siteUrl}/auth/confirm?next=${encodeURIComponent("/home")}`;
}
