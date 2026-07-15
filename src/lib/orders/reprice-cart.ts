import type { SupabaseClient } from "@supabase/supabase-js";
import {
  formatCartItemOrderName,
  getCartPriceBreakdown,
  normalizeCustomizations,
  type CartCustomizationSelection,
  type CartVariantSelection,
} from "@/lib/cart/line";
import {
  computePayableFromItemTotal,
  feeConfigForFulfillment,
} from "@/lib/cart/totals";
import { roundMoney } from "@/lib/coupons/discount";
import { getBusinessSettings } from "@/lib/business-settings";
import { validateCouponForUser } from "@/lib/supabase/coupons/coupons";
import type { FulfillmentType } from "@/types/order";
import type { IProduct } from "@/types/product";
import { mapProductRow } from "@/lib/supabase/product/products";

/** Client may send options for matching; prices/names are never trusted. */
export type CheckoutLineInput = {
  productId: string;
  quantity: number;
  variantName?: string | null;
  customizationLabels?: string[];
  /** @deprecated Ignored — kept for older clients. */
  name?: string;
  /** @deprecated Ignored — server recomputes. */
  price?: number;
  /** @deprecated Ignored — taken from product. */
  imageUrl?: string | null;
};

export type RepricedOrderLine = {
  productId: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
};

export type ServerOrderQuote =
  | {
      success: true;
      lines: RepricedOrderLine[];
      subtotal: number;
      discountAmount: number;
      couponId: string | null;
      couponCode: string | null;
      total: number;
    }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

const PRODUCT_PRICE_COLUMNS =
  "id, user_id, slug, name, category, order_type, short_description, long_description, add_discount, discount_percent, preparation_time_minutes, diet_type, food_tag, variants, customizations, nutrition, spice_levels, ingredients, allergens, is_available, image_url, image_urls, created_at, updated_at";

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function resolveVariant(
  product: IProduct,
  variantName: string | null | undefined,
): CartVariantSelection | null {
  const variants = product.variants ?? [];
  if (!variants.length) return null;

  const requested = variantName?.trim();
  if (requested) {
    const match = variants.find(
      (variant) => normalizeLabel(variant.name) === normalizeLabel(requested),
    );
    if (!match) return null;
    return { name: match.name, price: Number(match.price) || 0 };
  }

  const full = variants.find(
    (variant) => normalizeLabel(variant.name) === "full",
  );
  const selected = full ?? variants[0];
  return { name: selected.name, price: Number(selected.price) || 0 };
}

function resolveCustomizations(
  product: IProduct,
  labels: string[] | undefined,
):
  | { ok: true; selections: CartCustomizationSelection[] }
  | { ok: false; message: string } {
  const requested = [...new Set((labels ?? []).map((l) => l.trim()).filter(Boolean))];
  if (!requested.length) {
    return { ok: true, selections: [] };
  }

  const catalog = product.customizations ?? [];
  const selections: CartCustomizationSelection[] = [];

  for (const label of requested) {
    const match = catalog.find(
      (entry) => normalizeLabel(entry.label) === normalizeLabel(label),
    );
    if (!match) {
      return {
        ok: false,
        message: `Add-on "${label}" is not available for ${product.name}.`,
      };
    }
    selections.push({
      label: match.label,
      extra_price: Number(match.extra_price) || 0,
    });
  }

  return { ok: true, selections: normalizeCustomizations(selections) };
}

async function loadProductsByIds(
  supabase: SupabaseClient,
  productIds: string[],
): Promise<Map<string, IProduct>> {
  const uniqueIds = [...new Set(productIds.filter(Boolean))];
  if (!uniqueIds.length) return new Map();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_PRICE_COLUMNS)
    .in("id", uniqueIds);

  if (error) {
    throw error;
  }

  const map = new Map<string, IProduct>();
  for (const row of data ?? []) {
    const product = mapProductRow(row as Record<string, unknown>);
    if (product.id) map.set(product.id, product);
  }
  return map;
}

function repriceLine(
  product: IProduct,
  input: CheckoutLineInput,
):
  | { ok: true; line: RepricedOrderLine }
  | { ok: false; message: string } {
  const quantity = Math.floor(Number(input.quantity));
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { ok: false, message: `Invalid quantity for ${product.name}.` };
  }

  if (!product.is_available) {
    return { ok: false, message: `${product.name} is currently unavailable.` };
  }

  const variant = resolveVariant(product, input.variantName);
  if ((product.variants?.length ?? 0) > 0 && !variant) {
    return {
      ok: false,
      message: `Selected size is not available for ${product.name}.`,
    };
  }

  const customs = resolveCustomizations(product, input.customizationLabels);
  if (!customs.ok) {
    return customs;
  }

  const { unitPrice } = getCartPriceBreakdown(product, {
    variant,
    customizations: customs.selections,
  });

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return { ok: false, message: `Could not price ${product.name}.` };
  }

  const cartLike = {
    name: product.name,
    variant,
    customizations: customs.selections,
  };

  return {
    ok: true,
    line: {
      productId: product.id!,
      product_name: formatCartItemOrderName(cartLike),
      quantity,
      unit_price: roundMoney(unitPrice),
      image_url: product.image_url ?? null,
    },
  };
}

/**
 * Re-fetch products and compute trusted line prices + order totals.
 * Client unit prices are never used.
 */
export async function buildServerOrderQuote(
  supabase: SupabaseClient,
  input: {
    items: CheckoutLineInput[];
    fulfillment_type: FulfillmentType;
    coupon_code?: string | null;
    userId: string;
  },
): Promise<ServerOrderQuote> {
  if (!input.items.length) {
    return {
      success: false,
      message: "Your cart is empty.",
      status: 400,
      errors: { items: "Add at least one product." },
    };
  }

  let products: Map<string, IProduct>;
  try {
    products = await loadProductsByIds(
      supabase,
      input.items.map((item) => item.productId),
    );
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to load products.",
      status: 500,
    };
  }

  const lines: RepricedOrderLine[] = [];

  for (const item of input.items) {
    const product = products.get(item.productId);
    if (!product) {
      return {
        success: false,
        message: "One or more products are no longer available.",
        status: 400,
        errors: { items: "Product not found." },
      };
    }

    const priced = repriceLine(product, item);
    if (!priced.ok) {
      return {
        success: false,
        message: priced.message,
        status: 400,
        errors: { items: priced.message },
      };
    }
    lines.push(priced.line);
  }

  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + line.unit_price * line.quantity, 0),
  );

  let couponId: string | null = null;
  let couponCode: string | null = null;
  let discountAmount = 0;

  const requestedCoupon = input.coupon_code?.trim();
  if (requestedCoupon) {
    const couponResult = await validateCouponForUser(supabase, {
      code: requestedCoupon,
      subtotal,
      userId: input.userId,
    });

    if (!couponResult.success) {
      return {
        success: false,
        message: couponResult.message,
        status: couponResult.status,
        errors: { coupon_code: couponResult.message },
      };
    }

    couponId = couponResult.coupon.id;
    couponCode = couponResult.coupon.code;
    discountAmount = couponResult.discountAmount;
  }

  const settings = await getBusinessSettings();
  const payable = computePayableFromItemTotal(
    subtotal,
    discountAmount,
    feeConfigForFulfillment(settings, input.fulfillment_type),
  );

  const minOrder = Math.max(0, Number(settings.order.min_order_amount) || 0);
  if (minOrder > 0 && payable.amountToPay < minOrder) {
    return {
      success: false,
      message: `Minimum order amount is ₹${minOrder}.`,
      status: 400,
      errors: { items: `Minimum order amount is ₹${minOrder}.` },
    };
  }

  return {
    success: true,
    lines,
    subtotal,
    discountAmount,
    couponId,
    couponCode,
    total: payable.amountToPay,
  };
}
