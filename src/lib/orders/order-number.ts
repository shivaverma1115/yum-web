import type { SupabaseClient } from "@supabase/supabase-js";
import { getBusinessSettings } from "@/lib/business-settings";
import { DEFAULT_BUSINESS_SETTINGS } from "@/types/business-settings";
import type { IOrder } from "@/types/order";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Derive order-number prefix from store site name (e.g. "Yum" → "YUM"). */
export function toOrderNumberPrefix(siteName: string | null | undefined): string {
  const cleaned = (siteName ?? "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8);
  return cleaned || "YUM";
}

/**
 * Allocate the next public order number via DB RPC (atomic daily sequence).
 * Format: PREFIX-YYMMDD-NNNN (e.g. YUM-250711-0001).
 */
export async function allocateOrderNumber(
  supabase: SupabaseClient,
): Promise<string> {
  let prefix = "YUM";
  let timezone = DEFAULT_BUSINESS_SETTINGS.order.timezone;

  try {
    const settings = await getBusinessSettings();
    prefix = toOrderNumberPrefix(settings.general.site_name);
    timezone =
      settings.order.timezone?.trim() ||
      DEFAULT_BUSINESS_SETTINGS.order.timezone;
  } catch {
    // Fall back to defaults if settings are unavailable.
  }

  const { data, error } = await supabase.rpc("next_order_number", {
    p_prefix: prefix,
    p_timezone: timezone,
  });

  if (error || typeof data !== "string" || !data.trim()) {
    throw new Error(
      error?.message ?? "Failed to allocate order number.",
    );
  }

  return data.trim();
}

/**
 * Public order label for UI and notifications.
 * Prefers `order_number` (YUM-250711-0001); falls back to short UUID.
 */
export function formatOrderIdShort(
  orderOrId?: Pick<IOrder, "id" | "order_number"> | string | null,
): string {
  if (!orderOrId) return "—";

  if (typeof orderOrId === "string") {
    const trimmed = orderOrId.trim();
    if (!trimmed) return "—";
    if (UUID_RE.test(trimmed)) {
      return `#${trimmed.slice(0, 8).toUpperCase()}`;
    }
    return trimmed;
  }

  const number = orderOrId.order_number?.trim();
  if (number) return number;

  const id = orderOrId.id?.trim();
  if (id) {
    return UUID_RE.test(id) ? `#${id.slice(0, 8).toUpperCase()}` : id;
  }

  return "—";
}
