import { createProductOgImageResponse } from "@/lib/seo/create-product-og-image";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface OgProductRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: Request, { params }: OgProductRouteProps) {
  const { slug } = await params;

  try {
    return await createProductOgImageResponse(slug);
  } catch (error) {
    console.error(`[og/product/${slug}]`, error);
    return NextResponse.json(
      { error: "Failed to generate Open Graph image." },
      { status: 500 },
    );
  }
}
