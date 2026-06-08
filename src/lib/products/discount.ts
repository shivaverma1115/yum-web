export function calculateDiscountedPrice(
  sellingPrice: number | null | undefined,
  discountPercent: number | null | undefined,
): number | null {
  if (sellingPrice == null || !Number.isFinite(sellingPrice) || sellingPrice < 0) {
    return null;
  }

  if (
    discountPercent == null ||
    !Number.isFinite(discountPercent) ||
    discountPercent <= 0
  ) {
    return sellingPrice;
  }

  const clampedPercent = Math.min(100, Math.max(0, discountPercent));
  const discounted = sellingPrice * (1 - clampedPercent / 100);
  return Math.round(discounted * 100) / 100;
}
