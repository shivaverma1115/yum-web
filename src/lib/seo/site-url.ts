import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { resolvePublicSiteOrigin } from "@/lib/business-settings/site-url";

/** Absolute origin for sitemap, robots, and social metadata. */
export async function getPublicSiteOrigin(): Promise<string> {
  const settings = await getCachedBusinessSettings();
  return resolvePublicSiteOrigin(settings.general.site_url);
}

export function absoluteSitePath(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, "");
  if (pathname === "/" || pathname === "") {
    return `${base}/`;
  }
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
