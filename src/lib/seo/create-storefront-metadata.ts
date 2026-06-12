import type { Metadata } from "next";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import {
  getStorefrontSeoPage,
  storefrontOgImagePath,
  type StorefrontSeoPageKey,
} from "@/lib/seo/routes";

type CreateStorefrontMetadataOptions = {
  path?: string;
};

export async function createStorefrontMetadata(
  pageKey: StorefrontSeoPageKey,
  options?: CreateStorefrontMetadataOptions,
): Promise<Metadata> {
  const settings = await getCachedBusinessSettings();
  const page = getStorefrontSeoPage(pageKey);

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: options?.path ?? page.path,
    settings,
    ogImagePath: storefrontOgImagePath(pageKey),
    imageAlt: page.headline,
  });
}
