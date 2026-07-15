import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductDetails from "@/components/storefront/Products/ProductDetails";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  buildProductPageMetadata,
  productNotFoundMetadata,
} from "@/lib/seo/product-metadata";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getProductBySlugOrIdWithSupabase,
  listRelatedProductsWithSupabase,
} from "@/lib/supabase/product/products";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();
  const [result, settings] = await Promise.all([
    getProductBySlugOrIdWithSupabase(admin, slug),
    getCachedBusinessSettings(),
  ]);

  if (!result.success || !result.product.is_available) {
    return productNotFoundMetadata();
  }

  return buildProductPageMetadata(result.product, settings);
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const admin = createAdminClient();
  const result = await getProductBySlugOrIdWithSupabase(admin, slug);

  if (!result.success || !result.product.is_available) {
    notFound();
  }

  if (result.product.slug !== slug) {
    permanentRedirect(`/products/${result.product.slug}`);
  }

  const related = await listRelatedProductsWithSupabase(
    admin,
    result.product.id!,
  );

  return (
    <ProductDetails
      slug={result.product.slug}
      initialProduct={result.product}
      initialRelated={related}
    />
  );
}
