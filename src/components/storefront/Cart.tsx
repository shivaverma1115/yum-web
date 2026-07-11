"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import OrderSummary from "@/components/common/OrderSummary";
import { useCart } from "@/context-api/cart-context";
import { formatCartItemOptionsLabel } from "@/lib/cart/line";
import { getCartLinePricing } from "@/lib/cart/totals";
import { validateCouponCode } from "@/lib/coupons/client";
import { formatCurrency } from "@/lib/constants";
import type { ICartItem } from "@/types/cart";
import Input from "@/components/ui/Input";

function EmptyCart() {
  return (
    <section className="py-6 lg:py-10">
      <div className="container">
        <div className="mx-auto max-w-md rounded-2xl border border-default-200 bg-white px-6 py-16 text-center dark:bg-default-50">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-default-900">
            Your cart is empty
          </h1>
          <p className="mb-6 text-sm text-default-500">
            Add dishes from the menu to build your order.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
          >
            Browse menu
          </Link>
        </div>
      </div>
    </section>
  );
}

function CartLineItem({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: ICartItem;
  onRemove: (lineId: string) => void;
  onQuantityChange: (lineId: string, quantity: number) => void;
}) {
  const optionsLabel = formatCartItemOptionsLabel(item);
  const pricing = getCartLinePricing(item);
  const atMax = item.quantity >= item.maxQuantity;

  return (
    <article className="flex gap-3 border-b border-default-200 px-4 py-4 last:border-b-0 sm:gap-4 sm:px-6">
      <img
        src={item.image_url ?? "/images/dishes/pizza.png"}
        alt={item.name}
        className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-default-900 sm:text-base">
              {item.name}
            </h2>
            {optionsLabel ? (
              <p className="mt-0.5 text-xs text-default-500 sm:text-sm">
                {optionsLabel}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.lineId)}
            className="rounded-full p-1.5 text-default-400 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${item.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-default-500">
              Unit price
            </p>
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-sm font-semibold text-default-900">
                {formatCurrency(pricing.unitPrice)}
              </span>
              {pricing.compareAtUnit != null ? (
                <span className="text-xs text-default-400 line-through">
                  {formatCurrency(pricing.compareAtUnit)}
                </span>
              ) : null}
            </div>
            {pricing.addOnsTotal > 0 ? (
              <p className="mt-0.5 text-xs text-default-500">
                Includes add-ons {formatCurrency(pricing.addOnsTotal)}
              </p>
            ) : null}
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-default-200 p-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-default-100 text-default-800 transition-colors hover:bg-default-200"
              onClick={() => onQuantityChange(item.lineId, item.quantity - 1)}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm font-medium text-default-900">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={atMax}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-default-100 text-default-800 transition-colors hover:bg-default-200 disabled:opacity-40"
              onClick={() => onQuantityChange(item.lineId, item.quantity + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-end">
            <p className="text-[11px] uppercase tracking-wide text-default-500">
              Line total
            </p>
            <p className="text-sm font-semibold text-default-900">
              {formatCurrency(pricing.lineTotal)}
            </p>
            {pricing.compareLineTotal != null ? (
              <p className="text-xs text-default-400 line-through">
                {formatCurrency(pricing.compareLineTotal)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function CouponSection({
  subtotal,
  appliedCode,
  discountAmount,
  onApplied,
  onRemove,
}: {
  subtotal: number;
  appliedCode: string | null;
  discountAmount: number;
  onApplied: (coupon: import("@/types/coupon").AppliedCoupon) => void;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);

  const apply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Enter a coupon code.");
      return;
    }

    setApplying(true);
    try {
      const result = await validateCouponCode(trimmed, subtotal);
      if (!result.ok || !result.data.data?.coupon) {
        toast.error(result.data.message ?? "Invalid coupon code.");
        return;
      }
      onApplied(result.data.data.coupon);
      setCode("");
      toast.success(result.data.message ?? "Coupon applied.");
    } finally {
      setApplying(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/60 px-4 py-3.5 dark:bg-green-950/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
              <Tag className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-default-900">
                {appliedCode}
              </p>
              <p className="mt-0.5 text-xs font-medium text-green-700">
                You save {formatCurrency(discountAmount)}
              </p>
              <p className="mt-1 text-[11px] text-default-500">
                Each account can use this coupon once
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-default-500 transition-colors hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-default-200 bg-white px-4 py-4 shadow-sm dark:bg-default-50">
      <div className="mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" aria-hidden />
        <h3 className="text-sm font-semibold text-default-900">
          Have a coupon?
        </h3>
      </div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="rounded-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void apply();
            }
          }}
          aria-label="Coupon code"
        />
        <button
          type="button"
          disabled={applying}
          onClick={() => void apply()}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-primary bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500 disabled:opacity-60"
        >
          {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Apply
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const {
    items,
    bill,
    amountToPay,
    setAppliedCoupon,
    removeItem,
    setItemQuantity,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section className="py-6 lg:py-10">
      <div className="container">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-default-900">Your cart</h1>
          <p className="mt-1 text-sm text-default-500">
            {bill.itemsCount} item{bill.itemsCount === 1 ? "" : "s"} · Review
            prices before checkout
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-default-200 bg-white dark:bg-default-50">
              <div className="flex items-center justify-between gap-3 border-b border-default-200 px-4 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-default-900">
                  Order items
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-default-500 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Clear all
                </button>
              </div>

              <div>
                {items.map((item) => (
                  <CartLineItem
                    key={item.lineId}
                    item={item}
                    onRemove={removeItem}
                    onQuantityChange={setItemQuantity}
                  />
                ))}
              </div>

              <div className="border-t border-default-200 px-4 py-4 sm:px-6">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-default-200 px-5 py-2.5 text-sm font-medium text-default-700 transition-colors hover:border-primary hover:text-primary"
                >
                  Add more items
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <CouponSection
              subtotal={bill.itemTotal}
              appliedCode={bill.couponCode}
              discountAmount={bill.couponDiscount}
              onApplied={setAppliedCoupon}
              onRemove={() => setAppliedCoupon(null)}
            />

            <OrderSummary
              bill={bill}
              variant="collapsible"
              footer={
                <>
                  <p className="text-sm font-medium text-default-600">
                    Cancellation policy:
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-default-400">
                    Please double-check your order details. Orders are non-refundable once
                    placed.
                  </p>
                </>
              }
            />

            <Link
              href="/checkout"
              className="inline-flex w-full items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-500"
            >
              Proceed to checkout · {formatCurrency(amountToPay)}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
