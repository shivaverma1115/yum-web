import { ImageResponse } from "next/og";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { resolveOgBackgroundSrc } from "@/lib/seo/og-background";
import {
  FallbackOgCard,
  loadProductOgFonts,
  loadProductPhotoDataUrl,
  PRODUCT_OG_SIZE,
  ProductOgCard,
} from "@/lib/seo/product-opengraph";
import { productOgImage } from "@/lib/seo/product-metadata";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductBySlugOrIdWithSupabase } from "@/lib/supabase/product/products";

export async function createProductOgImageResponse(
  slug: string,
): Promise<ImageResponse> {
  const [fonts, backgroundImageUrl] = await Promise.all([
    loadProductOgFonts(),
    resolveOgBackgroundSrc(),
  ]);
  const settings = await getCachedBusinessSettings();
  const siteName = settings.general.site_name.trim() || "Yum";
  const currencySymbol = settings.general.currency_symbol.trim() || "₹";

  try {
    const admin = createAdminClient();
    const result = await getProductBySlugOrIdWithSupabase(admin, slug);

    if (!result.success || !result.product.is_available) {
      return new ImageResponse(
        <FallbackOgCard
          siteName={siteName}
          backgroundImageUrl={backgroundImageUrl}
        />,
        {
          ...PRODUCT_OG_SIZE,
          fonts,
        },
      );
    }

    const product = result.product;
    const productImageUrl = productOgImage(product);
    const productPhotoDataUrl = productImageUrl
      ? await loadProductPhotoDataUrl(productImageUrl)
      : undefined;

    return new ImageResponse(
      <ProductOgCard
        product={product}
        siteName={siteName}
        currencySymbol={currencySymbol}
        productImageUrl={productPhotoDataUrl ?? productImageUrl}
      />,
      {
        ...PRODUCT_OG_SIZE,
        fonts,
      },
    );
  } catch {
    return new ImageResponse(
      <FallbackOgCard
        siteName={siteName}
        backgroundImageUrl={backgroundImageUrl}
      />,
      {
        ...PRODUCT_OG_SIZE,
        fonts,
      },
    );
  }
}
