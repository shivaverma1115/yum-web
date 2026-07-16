import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { resolvePublicSiteOrigin } from "@/lib/business-settings/site-url";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";

export const OG_BACKGROUND_PUBLIC_PATH =
  "/images/og/bg-image/seo-background-image.png";

const OG_BACKGROUND_FILE = join(
  process.cwd(),
  "public",
  "images",
  "og",
  "bg-image",
  "seo-background-image.png",
);

/** Max size for embedding as data URL in Satori (large images must use HTTP URL). */
const MAX_DATA_URL_BYTES = 500_000;

async function canFetchUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "GET", cache: "force-cache" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function resolveOgBackgroundSrc(): Promise<string | undefined> {
  const settings = await getCachedBusinessSettings();
  const origin = resolvePublicSiteOrigin(settings.general.site_url);

  if (origin) {
    const publicUrl = `${origin}${OG_BACKGROUND_PUBLIC_PATH}`;
    if (await canFetchUrl(publicUrl)) {
      return publicUrl;
    }
  }

  try {
    await access(OG_BACKGROUND_FILE);
    const buffer = await readFile(OG_BACKGROUND_FILE);
    if (buffer.byteLength <= MAX_DATA_URL_BYTES) {
      return `data:image/png;base64,${buffer.toString("base64")}`;
    }
  } catch {
    return undefined;
  }

  return undefined;
}
