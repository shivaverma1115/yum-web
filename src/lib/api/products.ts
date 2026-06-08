import { normalizeOrderTypes } from "@/lib/order-types";
import type { IProduct } from "@/types/product";

function normalizeProduct(product: IProduct): IProduct {
  return {
    ...product,
    order_type: normalizeOrderTypes(product.order_type),
  };
}

export type ProductsListData = {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductsListResponse = {
  success?: boolean;
  message?: string;
  data?: ProductsListData;
};

export type FetchProductsPageOptions = {
  page?: number;
  limit?: number;
  search?: string;
  /** Product category slugs; omit or empty for all categories */
  categories?: string[];
  signal?: AbortSignal;
  /** Defaults to public catalog API */
  endpoint?: "/api/products" | "/api/admin/products";
};

export async function fetchProductsPage(
  options: FetchProductsPageOptions = {},
): Promise<ProductsListData> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const endpoint = options.endpoint ?? "/api/products";

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }

  if (options.categories?.length) {
    params.set("categories", options.categories.join(","));
  }

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    method: "GET",
    signal: options.signal,
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as ProductsListResponse;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message ?? "Failed to load products.");
  }

  return {
    ...result.data,
    products: result.data.products.map(normalizeProduct),
  };
}

export type ProductDetailResponse = {
  success?: boolean;
  message?: string;
  data?: { product: IProduct };
};

export async function fetchProduct(
  productId: string,
  signal?: AbortSignal,
): Promise<IProduct> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "GET",
    signal,
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as ProductDetailResponse;

  if (!response.ok || !result.success || !result.data?.product) {
    throw new Error(result.message ?? "Product not found.");
  }

  return normalizeProduct(result.data.product);
}

export function getProductImages(product: IProduct): string[] {
  const urls = [...(product.image_urls ?? [])];
  if (product.image_url && !urls.includes(product.image_url)) {
    urls.unshift(product.image_url);
  }
  if (urls.length === 0) {
    return ["/images/dishes/pizza.png"];
  }
  return urls;
}
