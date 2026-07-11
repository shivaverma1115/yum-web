import { getProductBasePrice } from "@/lib/cart/line";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import type { IProduct } from "@/types/product";

export type ProductPriceDisplay = {
  price: string;
  originalPrice?: string;
};

export function formatProductPriceDisplay(
  product: IProduct,
  currencySymbol: string,
): ProductPriceDisplay | null {
  const basePrice = getProductBasePrice(product);
  if (basePrice == null || !Number.isFinite(basePrice)) {
    return null;
  }

  const symbol = currencySymbol.trim() || "₹";
  const format = (value: number) =>
    `${symbol}${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const discounted = product.add_discount
    ? calculateDiscountedPrice(basePrice, product.discount_percent)
    : basePrice;

  if (
    discounted != null &&
    discounted < basePrice &&
    product.add_discount
  ) {
    return {
      price: format(discounted),
      originalPrice: format(basePrice),
    };
  }

  return { price: format(basePrice) };
}
