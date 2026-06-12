import type { Metadata } from "next";
import { resolveMetadataBase } from "@/lib/business-settings/site-url";
import type { BusinessSettings } from "@/types/business-settings";

export function buildSiteMetadata(settings: BusinessSettings): Metadata {
  const siteName = settings.general.site_name.trim() || "Yum";
  const metadataBase = resolveMetadataBase(settings.general.site_url);

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: {
      default: `${siteName} - Food Delivery`,
      template: `%s | ${siteName}`,
    },
    description: `${siteName} - Food Delivery`,
  };
}
