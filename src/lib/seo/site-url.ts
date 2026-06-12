import { getConfiguredSiteUrl } from "@/lib/business-settings/site-url";

/** Absolute origin for sitemap/robots when business settings omit site_url. */
export async function getPublicSiteOrigin(): Promise<string> {
  const configured = await getConfiguredSiteUrl();
  if (configured) {
    return configured;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function absoluteSitePath(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, "");
  if (pathname === "/" || pathname === "") {
    return `${base}/`;
  }
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
