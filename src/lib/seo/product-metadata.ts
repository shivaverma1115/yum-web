import type { Metadata } from "next";
import { richTextToPlainText } from "@/lib/rich-text";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import { productMetaTitle } from "@/lib/seo/product-meta-title";
import type { BusinessSettings } from "@/types/business-settings";
import type { IProduct } from "@/types/product";

const META_DESCRIPTION_MAX = 160;

export function productMetaDescription(
  product: IProduct,
  siteName?: string,
): string {
  const fromShort = richTextToPlainText(
    product.short_description,
    META_DESCRIPTION_MAX,
  );
  if (fromShort) {
    return fromShort;
  }

  const fromLong = richTextToPlainText(
    product.long_description,
    META_DESCRIPTION_MAX,
  );
  if (fromLong) {
    return fromLong;
  }

  const brand = siteName?.trim() || "us";
  return `Order ${product.name} from ${brand}.`;
}

export function productOgImage(product: IProduct): string | undefined {
  const url = product.image_url ?? product.image_urls?.[0];
  return url?.trim() || undefined;
}

export function buildProductPageMetadata(
  product: IProduct,
  settings: BusinessSettings,
): Metadata {
  const siteName = settings.general.site_name.trim() || "Yum";
  const title = productMetaTitle(product, siteName);
  const description = productMetaDescription(product, siteName);
  const canonicalPath = `/products/${product.slug}`;

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    settings,
    ogImagePath: `/api/og/product/${product.slug}`,
    imageAlt: product.name,
    absoluteTitle: true,
  });
}

export function productNotFoundMetadata(): Metadata {
  return {
    title: "Product not found",
    robots: {
      index: false,
      follow: false,
    },
  };
}
