"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Receipt } from "lucide-react";
import type { CartBillSummary } from "@/lib/cart/totals";
import { formatCurrency } from "@/lib/constants";

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
  /** Show helper hints under each row (cart style). Default true. */
  showHints?: boolean;
  totalLabel?: string;
};

/** Shared bill lines — identical on cart, checkout, and admin order details. */
export function OrderSummaryBreakdown({
  bill,
  showHints = true,
  totalLabel = "To Pay",
}: OrderSummaryBreakdownProps) {
  const {
    itemTotal,
    itemCompareTotal,
    productSavings,
    couponCode,
    couponDiscount,
    deliveryFee,
    miscellaneousFee,
    amountToPay,
  } = bill;

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

      <div className="mt-2 border-t border-default-200 pt-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-bold text-default-900">{totalLabel}</p>
          <p className="text-base font-bold text-default-900 tabular-nums">
            {formatCurrency(amountToPay)}
          </p>
        </div>
      </div>
    </div>
  );
}

export type OrderSummaryProps = {
  bill: CartBillSummary;
  variant?: "static" | "collapsible";
  title?: string;
  className?: string;
  showHints?: boolean;
  totalLabel?: string;
  footer?: ReactNode;
  /** When collapsible, start expanded. Default false. */
  defaultExpanded?: boolean;
};

/**
 * Global order summary — same breakdown everywhere (cart, checkout, admin).
 */
export default function OrderSummary({
  bill,
  variant = "static",
  title = "Order summary",
  className = "",
  showHints = true,
  totalLabel = "To Pay",
  footer,
  defaultExpanded = false,
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { amountToPay, amountCompare, totalSavings } = bill;

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
                  {totalLabel}
                </span>
                {amountCompare != null ? (
                  <span className="text-sm text-default-400 line-through">
                    {formatCurrency(amountCompare)}
                  </span>
                ) : null}
                <span className="text-base font-bold text-default-900">
                  {formatCurrency(amountToPay)}
                </span>
              </span>
              {totalSavings > 0 ? (
                <span className="mt-0.5 block text-xs font-medium text-green-600">
                  {formatCurrency(totalSavings)} saved on the total!
                </span>
              ) : (
                <span className="mt-0.5 block text-xs text-default-500">
                  Tap to see full bill details
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
                showHints={showHints}
                totalLabel={totalLabel}
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
        showHints={showHints}
        totalLabel={totalLabel}
      />
      {footer}
    </div>
  );
}
