import type { NextRequest } from "next/server";
import { getConfiguredSiteUrl } from "@/lib/business-settings/site-url";

/** Base URL for Supabase auth redirects (must be allow-listed in Supabase dashboard). */
export async function getSiteUrl(request?: NextRequest): Promise<string> {
  return getConfiguredSiteUrl(request);
}

export async function getPasswordResetCallbackUrl(
  request?: NextRequest,
): Promise<string> {
  const siteUrl = await getSiteUrl(request);
  return `${siteUrl}/auth/confirm?next=${encodeURIComponent("/reset-password")}`;
}

/** Used by signUp; confirmation emails use token_hash templates (Supabase Dashboard → Email Templates). */
export async function getEmailConfirmRedirectUrl(
  request?: NextRequest,
): Promise<string> {
  const siteUrl = await getSiteUrl(request);
  return `${siteUrl}/auth/confirm?next=${encodeURIComponent("/home")}`;
}
