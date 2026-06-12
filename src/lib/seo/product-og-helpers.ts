import { calculateDiscountedPrice } from "@/lib/products/discount";
import { richTextToPlainText } from "@/lib/rich-text";
import type { IProduct } from "@/types/product";

const OG_DESCRIPTION_MAX = 100;

export type OgProductPrice = {
  price: string;
  originalPrice?: string;
  discountPercent?: number;
};

export function splitProductName(name: string): { first: string; rest: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { first: parts[0] ?? name, rest: "" };
  }

  return {
    first: parts[0],
    rest: parts.slice(1).join(" "),
  };
}

function formatOgPrice(value: number, currencySymbol: string): string {
  const symbol = currencySymbol.trim() || "₹";
  const rounded = Math.round(value * 100) / 100;

  if (Number.isInteger(rounded)) {
    return `${symbol}${rounded.toLocaleString("en-IN")}`;
  }

  return `${symbol}${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getOgProductPrice(
  product: IProduct,
  currencySymbol: string,
): OgProductPrice | null {
  if (product.selling_price == null || !Number.isFinite(product.selling_price)) {
    return null;
  }

  const discounted = product.add_discount
    ? calculateDiscountedPrice(product.selling_price, product.discount_percent)
    : product.selling_price;

  if (
    discounted != null &&
    discounted < product.selling_price &&
    product.add_discount &&
    product.discount_percent
  ) {
    return {
      price: formatOgPrice(discounted, currencySymbol),
      originalPrice: formatOgPrice(product.selling_price, currencySymbol),
      discountPercent: Math.round(product.discount_percent),
    };
  }

  return { price: formatOgPrice(product.selling_price, currencySymbol) };
}

export function getOgProductDescription(product: IProduct): string {
  const fromShort = richTextToPlainText(
    product.short_description,
    OG_DESCRIPTION_MAX,
  );
  if (fromShort) {
    return fromShort;
  }

  return richTextToPlainText(product.long_description, OG_DESCRIPTION_MAX);
}

export type OgFeaturePill = {
  icon: string;
  label: string;
};

export function getOgProductFeatures(product: IProduct): OgFeaturePill[] {
  const features: OgFeaturePill[] = [
    { icon: "★", label: "4.8+ Customer Rating" },
  ];

  if (product.order_type.includes("delivery")) {
    features.push({ icon: "⚡", label: "Fast Delivery" });
  } else if (product.preparation_time_minutes) {
    features.push({
      icon: "⏱",
      label: `Ready in ${product.preparation_time_minutes} min`,
    });
  } else {
    features.push({ icon: "⚡", label: "Fast Delivery" });
  }

  if (product.ingredients.length > 0) {
    features.push({ icon: "✦", label: "Fresh Ingredients" });
  } else if (product.diet_type === "veg") {
    features.push({ icon: "✦", label: "100% Vegetarian" });
  } else {
    features.push({ icon: "✦", label: "Fresh Ingredients" });
  }

  return features.slice(0, 3);
}
