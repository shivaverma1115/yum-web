import { createPageOgImageResponse } from "@/lib/seo/create-page-og-image";
import { withOgImageCacheHeaders } from "@/lib/seo/og-image-response";
import {
  STOREFRONT_SEO_PAGES,
  type StorefrontSeoPageKey,
} from "@/lib/seo/routes";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface OgPageRouteProps {
  params: Promise<{
    pageKey: string;
  }>;
}

function isStorefrontSeoPageKey(value: string): value is StorefrontSeoPageKey {
  return value in STOREFRONT_SEO_PAGES;
}

export async function GET(_request: Request, { params }: OgPageRouteProps) {
  const { pageKey } = await params;

  if (!isStorefrontSeoPageKey(pageKey)) {
    return NextResponse.json({ error: "Page not found." }, { status: 404 });
  }

  try {
    const image = await createPageOgImageResponse(pageKey);
    return withOgImageCacheHeaders(image);
  } catch (error) {
    console.error(`[og/page/${pageKey}]`, error);
    return NextResponse.json(
      { error: "Failed to generate Open Graph image." },
      { status: 500 },
    );
  }
}
