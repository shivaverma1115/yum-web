import type { Metadata } from "next";
import { resolvePublicSiteOrigin } from "@/lib/business-settings/site-url";
import { PRODUCT_OG_SIZE } from "@/lib/seo/product-opengraph";
import { absoluteSitePath } from "@/lib/seo/site-url";
import type { BusinessSettings } from "@/types/business-settings";

export type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  settings: BusinessSettings;
  ogImagePath: string;
  imageAlt?: string;
  /** When true, skips the root layout title template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const siteName = input.settings.general.site_name.trim() || "Yum";
  const origin = resolvePublicSiteOrigin(input.settings.general.site_url);
  const canonicalUrl = absoluteSitePath(origin, input.path);
  const ogImageUrl = absoluteSitePath(origin, input.ogImagePath);
  const imageAlt = input.imageAlt?.trim() || input.title;

  return {
    title: input.absoluteTitle
      ? { absolute: input.title }
      : input.title,
    description: input.description,
    ...(input.noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: input.absoluteTitle
        ? input.title
        : `${input.title} | ${siteName}`,
      description: input.description,
      type: "website",
      siteName,
      url: canonicalUrl,
      locale: "en_IN",
      images: [
        {
          url: ogImageUrl,
          width: PRODUCT_OG_SIZE.width,
          height: PRODUCT_OG_SIZE.height,
          alt: imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.absoluteTitle
        ? input.title
        : `${input.title} | ${siteName}`,
      description: input.description,
      images: [
        {
          url: ogImageUrl,
          alt: imageAlt,
        },
      ],
    },
  };
}
