import type { IProduct } from "@/types/product";

const META_TITLE_MAX = 60;

function formatCategoryLabel(category: string): string {
  return category
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function productMetaTitle(product: IProduct, siteName?: string): string {
  const name = product.name.trim();
  const brand = siteName?.trim() || "Yum";
  const category = formatCategoryLabel(product.category);

  const candidates = [
    `${name} – ${category} | Order Online | ${brand}`,
    `${name} – ${category} | ${brand}`,
    `${name} – Order Online | ${brand}`,
    `${name} | ${brand}`,
  ];

  for (const title of candidates) {
    if (title.length <= META_TITLE_MAX) {
      return title;
    }
  }

  const suffix = ` | ${brand}`;
  const maxNameLength = META_TITLE_MAX - suffix.length;
  const truncatedName =
    name.length > maxNameLength
      ? `${name.slice(0, Math.max(maxNameLength - 1, 1))}…`
      : name;

  return `${truncatedName}${suffix}`;
}
