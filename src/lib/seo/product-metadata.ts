import type { Metadata } from "next";
import { richTextToPlainText } from "@/lib/rich-text";
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
  const description = productMetaDescription(product, siteName);
  const image = productOgImage(product);
  const canonicalPath = `/products/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      siteName,
      url: canonicalPath,
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: product.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: product.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
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
