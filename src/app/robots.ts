import type { MetadataRoute } from "next";
import { absoluteSitePath, getPublicSiteOrigin } from "@/lib/seo/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getPublicSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/user/",
        "/api/",
        "/auth/",
        "/login",
        "/register",
        "/recover-password",
        "/reset-password",
        "/cart",
        "/checkout",
        "/wishlist",
      ],
    },
    sitemap: absoluteSitePath(origin, "/sitemap.xml"),
    host: origin,
  };
}
