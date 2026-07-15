import type { FulfillmentType } from "@/types/order";

export const ORDER_TYPE_OPTIONS: { value: FulfillmentType; label: string }[] = [
  { value: "delivery", label: "Delivery" },
  { value: "pickup", label: "Pickup" },
  { value: "dine_in", label: "Dine in" },
];

const ORDER_TYPE_SET = new Set<string>(
  ORDER_TYPE_OPTIONS.map((option) => option.value),
);

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
