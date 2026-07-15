import type { MetadataRoute } from "next";
import { listStorefrontSitemapPages } from "@/lib/seo/routes";
import { absoluteSitePath, getPublicSiteOrigin } from "@/lib/seo/site-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { listSitemapProductsWithSupabase } from "@/lib/supabase/product/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getPublicSiteOrigin();
  const admin = createAdminClient();
  const products = await listSitemapProductsWithSupabase(admin);

  const staticEntries: MetadataRoute.Sitemap = listStorefrontSitemapPages().map(
    (page) => ({
      url: absoluteSitePath(origin, page.path),
      lastModified: new Date(),
      changeFrequency: page.sitemap.changeFrequency,
      priority: page.sitemap.priority,
    }),
  );

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteSitePath(origin, `/products/${product.slug}`),
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
