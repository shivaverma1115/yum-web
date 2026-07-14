import { roundMoney } from "@/lib/coupons/discount";
import type { ICartItem } from "@/types/cart";
import type { FulfillmentType } from "@/types/order";
import {
  DEFAULT_BUSINESS_SETTINGS,
  type BusinessSettings,
} from "@/types/business-settings";

/** @deprecated Prefer fee config from business settings. Kept for fallbacks. */
export const DELIVERY_LIST_FEE = 0;
export const DELIVERY_FEE = DEFAULT_BUSINESS_SETTINGS.order.delivery_charge;
/** @deprecated Razorpay is folded into miscellaneous_fee. */
export const RAZORPAY_FEE_RATE = 0;
export const MISCELLANEOUS_FEE_RATE = 0;
export const MISCELLANEOUS_FEE_MIN =
  DEFAULT_BUSINESS_SETTINGS.order.miscellaneous_fee;

export type CartFeeConfig = {
  deliveryFee: number;
  /** Flat fee including gateway / platform charges. */
  miscellaneousFee: number;
};

export type CartLinePricing = {
  unitPrice: number;
  compareAtUnit: number | null;
  lineTotal: number;
  compareLineTotal: number | null;
  addOnsTotal: number;
};

export type CartBillSummary = {
  itemsCount: number;
  itemTotal: number;
  itemCompareTotal: number | null;
  productSavings: number;
  couponCode: string | null;
  couponDiscount: number;
  deliveryFee: number;
  deliveryListFee: number;
  /** Always 0 — gateway costs are included in miscellaneousFee. */
  razorpayFee: number;
  miscellaneousFee: number;
  /** Final payable amount — use this everywhere (cart button, bill, checkout). */
  amountToPay: number;
  amountCompare: number | null;
  totalSavings: number;
};

export function feeConfigFromBusinessSettings(
  settings?: Pick<BusinessSettings, "order"> | null,
): CartFeeConfig {
  const order = settings?.order ?? DEFAULT_BUSINESS_SETTINGS.order;
  return {
    deliveryFee: Math.max(0, Number(order.delivery_charge) || 0),
    miscellaneousFee: Math.max(0, Number(order.miscellaneous_fee) || 0),
  };
}

/**
 * Delivery fee applies only for delivery orders; miscellaneous always applies.
 */
export function feeConfigForFulfillment(
  settings: Pick<BusinessSettings, "order"> | null | undefined,
  fulfillment: FulfillmentType | null | undefined,
): CartFeeConfig {
  const base = feeConfigFromBusinessSettings(settings);
  return {
    deliveryFee: fulfillment === "delivery" ? base.deliveryFee : 0,
    miscellaneousFee: base.miscellaneousFee,
  };
}

export function getCartLinePricing(item: ICartItem): CartLinePricing {
  const addOnsTotal = (item.customizations ?? []).reduce(
    (sum, entry) => sum + Math.max(0, entry.extra_price),
    0,
  );
  const variantPrice = item.variant?.price ?? null;
  const compareAtUnit =
    variantPrice != null ? roundMoney(variantPrice + addOnsTotal) : null;
  const unitPrice = item.price;
  const lineTotal = roundMoney(unitPrice * item.quantity);
  const compareLineTotal =
    compareAtUnit != null ? roundMoney(compareAtUnit * item.quantity) : null;

  return {
    unitPrice,
    compareAtUnit:
      compareAtUnit != null && compareAtUnit > unitPrice ? compareAtUnit : null,
    lineTotal,
    compareLineTotal:
      compareLineTotal != null && compareLineTotal > lineTotal
        ? compareLineTotal
        : null,
    addOnsTotal,
  };
}

/**
 * Payable total from item subtotal + coupon + admin-configured fees.
 * amountToPay = items − coupon + delivery + miscellaneous
 * (miscellaneous includes former Razorpay / gateway costs).
 */
export function computePayableFromItemTotal(
  itemTotalInput: number,
  couponDiscountInput = 0,
  feesInput?: Partial<CartFeeConfig> | null,
): Pick<
  CartBillSummary,
  | "itemTotal"
  | "couponDiscount"
  | "deliveryFee"
  | "deliveryListFee"
  | "razorpayFee"
  | "miscellaneousFee"
  | "amountToPay"
> {
  const defaults = feeConfigFromBusinessSettings(null);
  const fees: CartFeeConfig = {
    deliveryFee: roundMoney(
      Math.max(0, feesInput?.deliveryFee ?? defaults.deliveryFee),
    ),
    miscellaneousFee: roundMoney(
      Math.max(0, feesInput?.miscellaneousFee ?? defaults.miscellaneousFee),
    ),
  };

  const itemTotal = roundMoney(Math.max(0, itemTotalInput));
  const couponDiscount = roundMoney(
    Math.min(Math.max(0, couponDiscountInput), itemTotal),
  );
  const discountedItems = roundMoney(Math.max(0, itemTotal - couponDiscount));

  const amountToPay = roundMoney(
    discountedItems + fees.deliveryFee + fees.miscellaneousFee,
  );

  return {
    itemTotal,
    couponDiscount,
    deliveryFee: fees.deliveryFee,
    deliveryListFee: 0,
    razorpayFee: 0,
    miscellaneousFee: fees.miscellaneousFee,
    amountToPay,
  };
}

/**
 * Single source of truth for cart / checkout totals.
 */
export function computeCartBillSummary(input: {
  items: ICartItem[];
  subtotal: number;
  couponDiscount?: number;
  couponCode?: string | null;
  fees?: Partial<CartFeeConfig> | null;
}): CartBillSummary {
  let itemsCount = 0;
  let compareSubtotal = 0;
  let hasCompare = false;

  for (const item of input.items) {
    const pricing = getCartLinePricing(item);
    itemsCount += item.quantity;
    if (pricing.compareLineTotal != null) {
      compareSubtotal += pricing.compareLineTotal;
      hasCompare = true;
    } else {
      compareSubtotal += pricing.lineTotal;
    }
  }

  const payable = computePayableFromItemTotal(
    input.subtotal,
    input.couponDiscount ?? 0,
    input.fees,
  );
  const itemCompareTotal = hasCompare ? roundMoney(compareSubtotal) : null;
  const productSavings =
    itemCompareTotal != null && itemCompareTotal > payable.itemTotal
      ? roundMoney(itemCompareTotal - payable.itemTotal)
      : 0;

  const deliverySavings = 0;

  const amountCompare = roundMoney(
    (itemCompareTotal ?? payable.itemTotal) +
      payable.deliveryFee +
      payable.miscellaneousFee,
  );
  const totalSavings = roundMoney(
    productSavings + deliverySavings + payable.couponDiscount,
  );

  return {
    itemsCount,
    itemTotal: payable.itemTotal,
    itemCompareTotal,
    productSavings,
    couponCode:
      payable.couponDiscount > 0 ? (input.couponCode ?? null) : null,
    couponDiscount: payable.couponDiscount,
    deliveryFee: payable.deliveryFee,
    deliveryListFee: payable.deliveryListFee,
    razorpayFee: 0,
    miscellaneousFee: payable.miscellaneousFee,
    amountToPay: payable.amountToPay,
    amountCompare:
      amountCompare > payable.amountToPay ? amountCompare : null,
    totalSavings: totalSavings > 0 ? totalSavings : 0,
  };
}

/**
 * Reconstruct the same bill breakdown used on cart/checkout from a placed order.
 * Pass `lockedTotal` (order.total) so the summary always matches the stored total;
 * leftover fees after delivery are folded into miscellaneous.
 */
export function getOrderBillSummary(input: {
  subtotal: number;
  discountAmount?: number;
  couponCode?: string | null;
  fees?: Partial<CartFeeConfig> | null;
  lockedTotal?: number;
}): CartBillSummary {
  const payable = computePayableFromItemTotal(
    input.subtotal,
    input.discountAmount ?? 0,
    input.fees,
  );

  let deliveryFee = payable.deliveryFee;
  let miscellaneousFee = payable.miscellaneousFee;
  let amountToPay = payable.amountToPay;

  if (input.lockedTotal != null && Number.isFinite(input.lockedTotal)) {
    const afterDiscount = roundMoney(
      Math.max(0, payable.itemTotal - payable.couponDiscount),
    );
    const feesTotal = roundMoney(
      Math.max(0, input.lockedTotal - afterDiscount),
    );
    deliveryFee = roundMoney(Math.min(payable.deliveryFee, feesTotal));
    miscellaneousFee = roundMoney(Math.max(0, feesTotal - deliveryFee));
    amountToPay = roundMoney(Math.max(0, input.lockedTotal));
  }

  return {
    itemsCount: 0,
    itemTotal: payable.itemTotal,
    itemCompareTotal: null,
    productSavings: 0,
    couponCode:
      payable.couponDiscount > 0 ? (input.couponCode ?? null) : null,
    couponDiscount: payable.couponDiscount,
    deliveryFee,
    deliveryListFee: payable.deliveryListFee,
    razorpayFee: 0,
    miscellaneousFee,
    amountToPay,
    amountCompare: null,
    totalSavings: payable.couponDiscount > 0 ? payable.couponDiscount : 0,
  };
}
