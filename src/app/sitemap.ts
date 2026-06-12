import type { MetadataRoute } from "next";
import { absoluteSitePath, getPublicSiteOrigin } from "@/lib/seo/site-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { listSitemapProductsWithSupabase } from "@/lib/supabase/product/products";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getPublicSiteOrigin();
  const admin = createAdminClient();
  const products = await listSitemapProductsWithSupabase(admin);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((route) => ({
    url: absoluteSitePath(origin, route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteSitePath(origin, `/products/${product.slug}`),
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
