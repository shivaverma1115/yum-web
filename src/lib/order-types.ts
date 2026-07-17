import {
  FULFILLMENT_TYPE,
  FULFILLMENT_TYPES,
} from "@/lib/constants";
import type { FulfillmentType } from "@/types/order";

export const ORDER_TYPE_OPTIONS: { value: FulfillmentType; label: string }[] = [
  { value: FULFILLMENT_TYPE.DELIVERY, label: "Delivery" },
  { value: FULFILLMENT_TYPE.PICKUP, label: "Pickup" },
  { value: FULFILLMENT_TYPE.DINE_IN, label: "Dine in" },
];

const ORDER_TYPE_SET = new Set<string>(FULFILLMENT_TYPES);

export function isOrderType(value: string): value is FulfillmentType {
  return ORDER_TYPE_SET.has(value);
}

/** Accepts legacy single string or array from API / form state. */
export function normalizeOrderTypes(value: unknown): FulfillmentType[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(isOrderType);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) {
          return normalizeOrderTypes(parsed);
        }
      } catch {
        // fall through
      }
    }

    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((part) => part.trim())
        .filter(isOrderType);
    }

    return isOrderType(trimmed) ? [trimmed] : [];
  }

  return [];
}

export function getOrderTypeLabel(value: string): string {
  if (!isOrderType(value)) return value;
  return ORDER_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function formatOrderTypes(types: unknown): string {
  return normalizeOrderTypes(types)
    .map(getOrderTypeLabel)
    .join(", ");
}

export function parseOrderTypesFromFormData(formData: FormData): FulfillmentType[] {
  const entries = formData
    .getAll("order_type")
    .map((entry) => String(entry).trim())
    .filter(Boolean);

  if (entries.length === 1 && entries[0].startsWith("[")) {
    return normalizeOrderTypes(entries[0]);
  }

  return normalizeOrderTypes(entries);
}

const ALL_FULFILLMENT_TYPES: FulfillmentType[] = [...FULFILLMENT_TYPES];

/**
 * Intersection of cart line order types (order preserved).
 * Missing/empty order_type on a line is treated as all types (legacy carts).
 */
export function getCartAllowedFulfillmentTypes(
  items: { order_type?: FulfillmentType[] | null }[],
): FulfillmentType[] {
  if (!items.length) return [...ALL_FULFILLMENT_TYPES];

  let allowed: FulfillmentType[] | null = null;

  for (const item of items) {
    const normalized = normalizeOrderTypes(item.order_type);
    const itemTypes =
      normalized.length > 0 ? normalized : ALL_FULFILLMENT_TYPES;

    allowed =
      allowed === null
        ? [...itemTypes]
        : allowed.filter((type) => itemTypes.includes(type));
  }

  return ALL_FULFILLMENT_TYPES.filter((type) => allowed?.includes(type));
}
