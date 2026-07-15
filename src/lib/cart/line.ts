import type { ProductCustomization, ProductVariant } from "@/lib/products/attributes";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import type { ICartItem } from "@/types/cart";
import type { IProduct } from "@/types/product";

export type CartCustomizationSelection = {
  label: string;
  extra_price: number;
};

export type CartVariantSelection = {
  name: string;
  price: number;
};

export type CartItemOptions = {
  variant?: CartVariantSelection | null;
  customizations?: CartCustomizationSelection[];
};

export function buildCartLineId(
  productId: string,
  variantName: string | null | undefined,
  customizations: CartCustomizationSelection[] = [],
): string {
  const addonKey = [...customizations]
    .map((item) => item.label.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join("|");

  return `${productId}::${(variantName ?? "").trim().toLowerCase()}::${addonKey}`;
}

export function normalizeCustomizations(
  customizations: CartCustomizationSelection[] | undefined,
): CartCustomizationSelection[] {
  if (!customizations?.length) return [];

  return [...customizations]
    .map((item) => ({
      label: item.label.trim(),
      extra_price: Number(item.extra_price) || 0,
    }))
    .filter((item) => item.label)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getPrimaryVariant(
  variants: Array<{ name: string; price: number }> | null | undefined,
): CartVariantSelection | null {
  if (!variants?.length) return null;

  const full = variants.find(
    (variant) => variant.name.trim().toLowerCase() === "full",
  );
  const selected = full ?? variants[0];
  if (!selected?.name?.trim() || !Number.isFinite(selected.price)) {
    return null;
  }

  return { name: selected.name, price: selected.price };
}

export function getDefaultVariant(
  product: Pick<IProduct, "variants">,
): CartVariantSelection | null {
  return getPrimaryVariant(product.variants);
}

export function getProductBasePrice(
  product: Pick<IProduct, "variants">,
): number | null {
  return getPrimaryVariant(product.variants)?.price ?? null;
}

export function calculateCartUnitPrice(
  product: IProduct,
  options: CartItemOptions = {},
): number {
  return getCartPriceBreakdown(product, options).unitPrice;
}

/** Unit price after discount, plus compare-at (pre-discount) when a discount applies. */
export function getCartPriceBreakdown(
  product: IProduct,
  options: CartItemOptions = {},
): { unitPrice: number; compareAtPrice: number | null } {
  const variant = options.variant ?? null;
  const customizations = normalizeCustomizations(options.customizations);

  const basePrice =
    variant?.price ?? getPrimaryVariant(product.variants)?.price ?? 0;

  const addOnsTotal = customizations.reduce(
    (sum, item) => sum + Math.max(0, item.extra_price),
    0,
  );

  const hasDiscount =
    Boolean(product.add_discount) &&
    product.discount_percent != null &&
    product.discount_percent > 0;

  const discountedBase = hasDiscount
    ? (calculateDiscountedPrice(basePrice, product.discount_percent) ??
      basePrice)
    : basePrice;

  const unitPrice = Math.round((discountedBase + addOnsTotal) * 100) / 100;
  const compareAtPrice = Math.round((basePrice + addOnsTotal) * 100) / 100;

  return {
    unitPrice,
    compareAtPrice:
      hasDiscount && compareAtPrice > unitPrice ? compareAtPrice : null,
  };
}

export function formatCartItemOptionsLabel(
  item: Pick<ICartItem, "variant" | "customizations">,
): string {
  const parts: string[] = [];

  if (item.variant?.name) {
    parts.push(item.variant.name);
  }

  for (const customization of item.customizations ?? []) {
    parts.push(customization.label);
  }

  return parts.join(" · ");
}

export function formatCartItemOrderName(
  item: Pick<ICartItem, "name" | "variant" | "customizations">,
): string {
  const options = formatCartItemOptionsLabel(item);
  return options ? `${item.name} (${options})` : item.name;
}

export function isSameCartConfiguration(
  item: ICartItem,
  productId: string,
  options: CartItemOptions = {},
): boolean {
  return (
    item.lineId ===
    buildCartLineId(
      productId,
      options.variant?.name,
      normalizeCustomizations(options.customizations),
    )
  );
}

export function toCartVariant(
  variant: ProductVariant | null | undefined,
): CartVariantSelection | null {
  if (!variant?.name) return null;
  return { name: variant.name, price: Number(variant.price) || 0 };
}

export function toCartCustomizations(
  items: ProductCustomization[] | undefined,
): CartCustomizationSelection[] {
  return normalizeCustomizations(
    (items ?? []).map((item) => ({
      label: item.label,
      extra_price: item.extra_price,
    })),
  );
}
