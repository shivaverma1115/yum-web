import type { IProductCategory } from "@/types/product-category";

export type ProductCategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: { categories: IProductCategory[] };
};

export async function fetchProductCategories(
  signal?: AbortSignal,
): Promise<IProductCategory[]> {
  const response = await fetch("/api/product-categories", {
    method: "GET",
    signal,
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as ProductCategoriesResponse;

  if (!response.ok || !result.success || !result.data?.categories) {
    throw new Error(result.message ?? "Failed to load categories.");
  }

  return result.data.categories;
}
