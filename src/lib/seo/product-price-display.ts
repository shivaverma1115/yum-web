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
  if (product.selling_price == null || !Number.isFinite(product.selling_price)) {
    return null;
  }

  const symbol = currencySymbol.trim() || "₹";
  const format = (value: number) =>
    `${symbol}${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const discounted = product.add_discount
    ? calculateDiscountedPrice(product.selling_price, product.discount_percent)
    : product.selling_price;

  if (
    discounted != null &&
    discounted < product.selling_price &&
    product.add_discount
  ) {
    return {
      price: format(discounted),
      originalPrice: format(product.selling_price),
    };
  }

  return { price: format(product.selling_price) };
}
