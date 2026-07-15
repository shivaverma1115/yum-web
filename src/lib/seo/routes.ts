import type { MetadataRoute } from "next";

export type StorefrontSeoPageKey =
  | "home"
  | "products"
  | "contact"
  | "faqs";

export type StorefrontSeoPage = {
  path: string;
  title: string;
  description: string;
  headline: string;
  sitemap: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  };
};

export const STOREFRONT_SEO_PAGES: Record<
  StorefrontSeoPageKey,
  StorefrontSeoPage
> = {
  home: {
    path: "/",
    title: "Order Food Online",
    description:
      "Browse fresh meals and order delivery, pickup, or dine-in from Yum.",
    headline: "Fresh food, delivered fast",
    sitemap: { changeFrequency: "daily", priority: 1 },
  },
  products: {
    path: "/products",
    title: "Browse Menu & Order Online",
    description:
      "Explore our full menu of dishes. Filter, search, and add favorites to your cart.",
    headline: "Explore our full menu",
    sitemap: { changeFrequency: "daily", priority: 0.9 },
  },
  contact: {
    path: "/contact",
    title: "Contact Us",
    description:
      "Get in touch with Yum for order help, feedback, and customer support.",
    headline: "We are here to help",
    sitemap: { changeFrequency: "monthly", priority: 0.5 },
  },
  faqs: {
    path: "/faqs",
    title: "Frequently Asked Questions",
    description:
      "Find answers about ordering, delivery, payments, and account support at Yum.",
    headline: "Answers to common questions",
    sitemap: { changeFrequency: "monthly", priority: 0.5 },
  },
};

export function getStorefrontSeoPage(
  pageKey: StorefrontSeoPageKey,
): StorefrontSeoPage {
  return STOREFRONT_SEO_PAGES[pageKey];
}

export function getStorefrontSeoPageByPath(
  path: string,
): (StorefrontSeoPage & { pageKey: StorefrontSeoPageKey }) | null {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;

  for (const [pageKey, page] of Object.entries(STOREFRONT_SEO_PAGES) as Array<
    [StorefrontSeoPageKey, StorefrontSeoPage]
  >) {
    if (page.path === normalized) {
      return { ...page, pageKey };
    }
  }

  return null;
}

export function listStorefrontSitemapPages(): Array<
  StorefrontSeoPage & { pageKey: StorefrontSeoPageKey }
> {
  return (Object.entries(STOREFRONT_SEO_PAGES) as Array<
    [StorefrontSeoPageKey, StorefrontSeoPage]
  >).map(([pageKey, page]) => ({ ...page, pageKey }));
}

export function storefrontOgImagePath(pageKey: StorefrontSeoPageKey): string {
  return `/api/og/page/${pageKey}`;
}
