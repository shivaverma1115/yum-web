import { ImageResponse } from "next/og";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  getStorefrontSeoPage,
  type StorefrontSeoPageKey,
} from "@/lib/seo/routes";
import { resolveOgBackgroundSrc } from "@/lib/seo/og-background";
import {
  loadProductOgFonts,
  PageOgCard,
  PRODUCT_OG_SIZE,
} from "@/lib/seo/page-opengraph";

export async function createPageOgImageResponse(
  pageKey: StorefrontSeoPageKey,
): Promise<ImageResponse> {
  const [fonts, backgroundImageUrl] = await Promise.all([
    loadProductOgFonts(),
    resolveOgBackgroundSrc(),
  ]);
  const settings = await getCachedBusinessSettings();
  const siteName = settings.general.site_name.trim() || "Yum";
  const page = getStorefrontSeoPage(pageKey);

  return new ImageResponse(
    <PageOgCard
      siteName={siteName}
      headline={page.headline}
      backgroundImageUrl={backgroundImageUrl}
    />,
    {
      ...PRODUCT_OG_SIZE,
      fonts,
    },
  );
}
