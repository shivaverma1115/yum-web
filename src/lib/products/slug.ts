import type { IProduct } from "@/types/product";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function slugifyProductName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "product";
}

export function isProductUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

export function productPath(
  product: Pick<IProduct, "slug" | "id">,
): string {
  if (product.slug?.trim()) {
    return `/products/${product.slug.trim()}`;
  }
  if (product.id) {
    return `/products/${product.id}`;
  }
  return "/products";
}
