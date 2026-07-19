export const ERROR_MESSAGE_GENERIC = 'Something went wrong. Please try again later.';

/** Minimum length for account passwords (register, reset, change). */
export const MIN_PASSWORD_LENGTH = 8;

export function passwordMinLengthMessage(
  min = MIN_PASSWORD_LENGTH,
): string {
  return `Password must be at least ${min} characters.`;
}

/** Canonical fulfillment / order-type values — use these instead of string literals. */
export const FULFILLMENT_TYPE = {
  DELIVERY: "delivery",
  PICKUP: "pickup",
  DINE_IN: "dine_in",
} as const;

export const FULFILLMENT_TYPES = [
  FULFILLMENT_TYPE.DELIVERY,
  FULFILLMENT_TYPE.PICKUP,
  FULFILLMENT_TYPE.DINE_IN,
] as const;

export type FulfillmentTypeValue = (typeof FULFILLMENT_TYPES)[number];

export function formatCustomerSince(createdAt?: string) {
    if (!createdAt) return "—";
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(value);
}

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const TABLE_QR_BUCKET = "table-qr";
export const TABLE_QR_IMAGE_SIZE = 512;
export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 1024 * 1024;
export const ALLOWED_PRODUCT_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

// Use a Unicode escape so SSR and the client always agree (avoids .env encoding /
// non-NEXT_PUBLIC env mismatches that hydrate as â‚¹ vs ₹).
export const CURRENCY_SYMBOL = "\u20B9";

export const DEFAULT_USER_IMAGE = "/images/avatars/images.png";