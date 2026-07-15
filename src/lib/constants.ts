export const ERROR_MESSAGE_GENERIC = 'Something went wrong. Please try again later.';

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

export const CURRENCY_SYMBOL = process.env.CURRENCY_SYMBOL || "₹";

export const DEFAULT_USER_IMAGE = "/images/avatars/images.png";