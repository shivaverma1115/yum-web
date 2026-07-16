import type { IProductCategory } from "@/types/product-category";

export type ProductCategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: { categories: IProductCategory[] };
};

async function parseCategoriesResponse(
  response: Response,
): Promise<IProductCategory[]> {
  const result = (await response
    .json()
    .catch(() => ({}))) as ProductCategoriesResponse;

  if (!response.ok || !result.success || !result.data?.categories) {
    throw new Error(result.message ?? "Failed to load categories.");
  }

  return result.data.categories;
}

/** Storefront: active categories that currently have available products. */
export async function fetchProductCategories(
  signal?: AbortSignal,
): Promise<IProductCategory[]> {
  const response = await fetch("/api/product-categories", {
    method: "GET",
    signal,
    cache: "no-store",
  });

  return parseCategoriesResponse(response);
}

/** Admin product form: all categories (including empty / inactive). */
export async function fetchAdminProductCategories(
  signal?: AbortSignal,
): Promise<IProductCategory[]> {
  const response = await fetch("/api/admin/product-categories", {
    method: "GET",
    signal,
    cache: "no-store",
    credentials: "include",
  });

  return parseCategoriesResponse(response);
}
