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

export function resolveMetadataBase(siteUrl: string): URL | undefined {
  const trimmed = siteUrl?.trim();

  if (!trimmed || !isValidSiteUrl(trimmed)) {
    return undefined;
  }

  return new URL(normalizeSiteUrl(trimmed));
}
