import type { NextRequest } from "next/server";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { DEFAULT_BUSINESS_SETTINGS } from "@/types/business-settings";

export function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

export function isValidSiteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isLocalhostSiteUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname === "::1"
    );
  } catch {
    return false;
  }
}

function resolveDeploymentSiteOrigin(): string | null {
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && isValidSiteUrl(envUrl)) {
    return normalizeSiteUrl(envUrl);
  }

  return null;
}

/** Public origin for SEO metadata, sitemap, and share previews. */
export function resolvePublicSiteOrigin(
  configuredUrl: string | undefined | null,
): string {
  const trimmed = configuredUrl?.trim();
  const deploymentOrigin = resolveDeploymentSiteOrigin();

  if (trimmed && isValidSiteUrl(trimmed) && !isLocalhostSiteUrl(trimmed)) {
    return normalizeSiteUrl(trimmed);
  }

  if (deploymentOrigin) {
    return deploymentOrigin;
  }

  if (trimmed && isValidSiteUrl(trimmed)) {
    return normalizeSiteUrl(trimmed);
  }

  const defaultUrl = DEFAULT_BUSINESS_SETTINGS.general.site_url;
  if (isValidSiteUrl(defaultUrl) && !isLocalhostSiteUrl(defaultUrl)) {
    return normalizeSiteUrl(defaultUrl);
  }

  return "http://localhost:3000";
}

export function resolveSiteUrl(
  configuredUrl: string | undefined | null,
  request?: NextRequest,
): string {
  const trimmed = configuredUrl?.trim();

  if (trimmed && isValidSiteUrl(trimmed)) {
    return normalizeSiteUrl(trimmed);
  }

  if (request) {
    return normalizeSiteUrl(new URL(request.url).origin);
  }

  const defaultUrl = DEFAULT_BUSINESS_SETTINGS.general.site_url;
  if (isValidSiteUrl(defaultUrl)) {
    return normalizeSiteUrl(defaultUrl);
  }

  return "";
}

export async function getConfiguredSiteUrl(
  request?: NextRequest,
): Promise<string> {
  const settings = await getCachedBusinessSettings();
  return resolveSiteUrl(settings.general.site_url, request);
}

export function resolveMetadataBase(
  configuredUrl: string | undefined | null,
): URL | undefined {
  const origin = resolvePublicSiteOrigin(configuredUrl);

  if (!isValidSiteUrl(origin)) {
    return undefined;
  }

  return new URL(origin);
}
