"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Receipt } from "lucide-react";
import type { CartBillSummary } from "@/lib/cart/totals";
import { formatCurrency } from "@/lib/constants";
import { roundMoney } from "@/lib/coupons/discount";

/**
 * `estimate` — cart: items (+ coupon) only; fees come later at checkout.
 * `final` — checkout / admin: full payable with delivery & miscellaneous.
 */
export type OrderSummaryMode = "estimate" | "final";

export function getOrderSummaryPayable(
  bill: CartBillSummary,
  mode: OrderSummaryMode = "final",
) {
  if (mode === "estimate") {
    const amountToPay = roundMoney(
      Math.max(0, bill.itemTotal - bill.couponDiscount),
    );
    const amountCompare =
      bill.itemCompareTotal != null && bill.itemCompareTotal > amountToPay
        ? bill.itemCompareTotal
        : null;
    const totalSavings = roundMoney(
      bill.productSavings + bill.couponDiscount,
    );

    return {
      amountToPay,
      amountCompare,
      totalSavings: totalSavings > 0 ? totalSavings : 0,
    };
  }

  return {
    amountToPay: bill.amountToPay,
    amountCompare: bill.amountCompare,
    totalSavings: bill.totalSavings,
  };
}

function SummaryRow({
  label,
  hint,
  value,
  compareValue,
  valueClassName,
  freeLabel,
}: {
  label: ReactNode;
  hint?: string;
  value: string;
  compareValue?: string | null;
  valueClassName?: string;
  freeLabel?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-default-700">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-default-400">{hint}</p> : null}
      </div>
      <div className="shrink-0 text-end">
        {compareValue ? (
          <span className="me-1.5 text-xs text-default-400 line-through">
            {compareValue}
          </span>
        ) : null}
        <span
          className={
            valueClassName ??
            (freeLabel
              ? "text-sm font-semibold text-green-600"
              : "text-sm font-medium text-default-800")
          }
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export type OrderSummaryBreakdownProps = {
  bill: CartBillSummary;
  mode?: OrderSummaryMode;
  /** Show helper hints under each row (cart style). Default true. */
  showHints?: boolean;
  totalLabel?: string;
  /**
   * When false, hides the delivery fee row (pickup / dine-in).
   * Default true for `final` mode.
   */
  showDeliveryFee?: boolean;
};

/** Shared bill lines — cart (estimate) or checkout/admin (final). */
export function OrderSummaryBreakdown({
  bill,
  mode = "final",
  showHints = true,
  totalLabel,
  showDeliveryFee,
}: OrderSummaryBreakdownProps) {
  const {
    itemTotal,
    itemCompareTotal,
    productSavings,
    couponCode,
    couponDiscount,
    deliveryFee,
    miscellaneousFee,
  } = bill;

  const payable = getOrderSummaryPayable(bill, mode);
  const isEstimate = mode === "estimate";
  const resolvedTotalLabel =
    totalLabel ?? (isEstimate ? "Items total" : "To Pay");
  const includeDelivery = showDeliveryFee ?? !isEstimate;

  return (
    <div>
      <SummaryRow
        label="Item total"
        hint={
          showHints ? "Product price after discounts & add-ons" : undefined
        }
        value={formatCurrency(itemTotal)}
        compareValue={
          itemCompareTotal != null ? formatCurrency(itemCompareTotal) : null
        }
        valueClassName={
          productSavings > 0
            ? "text-sm font-semibold text-green-600"
            : undefined
        }
      />

      {couponDiscount > 0 && couponCode ? (
        <SummaryRow
          label={`Coupon (${couponCode})`}
          hint={showHints ? "One-time discount for your account" : undefined}
          value={`−${formatCurrency(couponDiscount)}`}
          valueClassName="text-sm font-semibold text-green-600"
        />
      ) : null}

      {!isEstimate ? (
        <>
          {includeDelivery ? (
            <SummaryRow
              label="Delivery fee"
              hint={
                showHints
                  ? deliveryFee === 0
                    ? "No delivery charge on this order"
                    : "Delivery partner fee"
                  : undefined
              }
              value={deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
              freeLabel={deliveryFee === 0}
            />
          ) : null}

          <div className="my-1 border-t border-dashed border-default-200" />

          <SummaryRow
            label="Miscellaneous"
            hint={
              showHints
                ? "Platform, handling & payment gateway charges"
                : undefined
            }
            value={formatCurrency(miscellaneousFee)}
          />
        </>
      ) : showHints ? (
        <p className="py-2 text-xs leading-relaxed text-default-400">
          Delivery and other fees are calculated on checkout after you choose an
          order type.
        </p>
      ) : null}

      <div className="mt-2 border-t border-default-200 pt-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-bold text-default-900">
            {resolvedTotalLabel}
          </p>
          <p className="text-base font-bold text-default-900 tabular-nums">
            {formatCurrency(payable.amountToPay)}
          </p>
        </div>
      </div>
    </div>
  );
}

export type OrderSummaryProps = {
  bill: CartBillSummary;
  /** `estimate` for cart; `final` for checkout / paid orders. Default `final`. */
  mode?: OrderSummaryMode;
  variant?: "static" | "collapsible";
  title?: string;
  className?: string;
  showHints?: boolean;
  totalLabel?: string;
  showDeliveryFee?: boolean;
  footer?: ReactNode;
  /** When collapsible, start expanded. Default false. */
  defaultExpanded?: boolean;
};

/**
 * Global order summary — estimate on cart, final on checkout/admin.
 */
export default function OrderSummary({
  bill,
  mode = "final",
  variant = "static",
  title = "Order summary",
  className = "",
  showHints = true,
  totalLabel,
  showDeliveryFee,
  footer,
  defaultExpanded = false,
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const payable = getOrderSummaryPayable(bill, mode);
  const resolvedTotalLabel =
    totalLabel ?? (mode === "estimate" ? "Items total" : "To Pay");

  if (variant === "collapsible") {
    return (
      <div className={className}>
        <div className="overflow-hidden rounded-2xl border border-default-200 bg-white shadow-sm dark:bg-default-50">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-default-50/80"
            aria-expanded={expanded}
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
              <Receipt className="h-4 w-4" aria-hidden />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-sm font-medium text-default-700">
                  {resolvedTotalLabel}
                </span>
                {payable.amountCompare != null ? (
                  <span className="text-sm text-default-400 line-through">
                    {formatCurrency(payable.amountCompare)}
                  </span>
                ) : null}
                <span className="text-base font-bold text-default-900">
                  {formatCurrency(payable.amountToPay)}
                </span>
              </span>
              {payable.totalSavings > 0 ? (
                <span className="mt-0.5 block text-xs font-medium text-green-600">
                  {formatCurrency(payable.totalSavings)} saved on items!
                </span>
              ) : (
                <span className="mt-0.5 block text-xs text-default-500">
                  {mode === "estimate"
                    ? "Tap for item details · fees at checkout"
                    : "Tap to see full bill details"}
                </span>
              )}
            </span>

            <ChevronDown
              className={`h-5 w-5 shrink-0 text-default-500 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </button>

          {expanded ? (
            <div className="border-t border-default-200 px-4 pb-4 pt-1">
              <OrderSummaryBreakdown
                bill={bill}
                mode={mode}
                showHints={showHints}
                totalLabel={resolvedTotalLabel}
                showDeliveryFee={showDeliveryFee}
              />
            </div>
          ) : null}
        </div>

        {footer ? <div className="mt-4 px-1">{footer}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-default-200 bg-white p-4 dark:bg-default-50/40 ${className}`}
    >
      {title ? (
        <h5 className="mb-2 text-sm font-semibold text-default-900">{title}</h5>
      ) : null}
      <OrderSummaryBreakdown
        bill={bill}
        mode={mode}
        showHints={showHints}
        totalLabel={resolvedTotalLabel}
        showDeliveryFee={showDeliveryFee}
      />
      {footer}
    </div>
  );
}
