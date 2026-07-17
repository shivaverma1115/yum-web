"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Search,
  Store,
  Utensils,
} from "lucide-react";
import { OrderSummaryBreakdown } from "@/components/common/OrderSummary";
import { useBusinessSettings } from "@/context-api/business-settings-context";
import { useContextApi } from "@/context-api/use-context";
import { useOrdersRealtime } from "@/hooks/orders/use-orders-realtime";
import {
  feeConfigForFulfillment,
  getOrderBillSummary,
} from "@/lib/cart/totals";
import { formatCurrency, FULFILLMENT_TYPE } from "@/lib/constants";
import { getTimelineLabels } from "@/lib/orders/status-label";
import type {
  FulfillmentType,
  IOrderWithItems,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/order";

type TrackOrderResponse = {
  success: boolean;
  message?: string;
  data?: { order: IOrderWithItems };
};

const ORDER_STEP_INDEX: Record<Exclude<OrderStatus, "cancelled">, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  completed: 3,
};

const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  [FULFILLMENT_TYPE.DELIVERY]: "Delivery",
  [FULFILLMENT_TYPE.PICKUP]: "Pickup / Takeaway",
  [FULFILLMENT_TYPE.DINE_IN]: "Dine in / On table",
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash_on_delivery: "Cash on delivery",
  pay_at_counter: "Pay at counter",
  pay_at_table: "Pay at table",
  online: "UPI / Online",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

function formatOrderDate(value?: string) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPaymentStatus(order: IOrderWithItems): PaymentStatus {
  if (order.payment_method !== "online") return order.payment_status ?? "pending";
  return order.payment_status ?? "pending";
}

function statusPillClass(status: PaymentStatus) {
  if (status === "paid") return "bg-emerald-500 text-white";
  if (status === "failed") return "bg-red-500 text-white";
  return "bg-amber-500 text-white";
}

function DetailCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Package;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-default-200 bg-white p-3 shadow-sm dark:bg-default-50 sm:p-4">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-default-900">
        <Icon className="size-4 text-primary" aria-hidden />
        {title}
      </h2>
      <div className="space-y-1 text-xs leading-relaxed text-default-600 sm:text-sm">
        {children}
      </div>
    </section>
  );
}

function OrderTimeline({ order }: { order: IOrderWithItems }) {
  const labels = getTimelineLabels(order.fulfillment_type);
  const cancelled = order.status === "cancelled";
  const activeIndex =
    order.status === "cancelled" ? 0 : ORDER_STEP_INDEX[order.status];
  const progress =
    labels.length > 1 ? (activeIndex / (labels.length - 1)) * 100 : 100;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-default-900 sm:text-lg">
          Order Status
        </h2>
        {cancelled ? (
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600">
            Cancelled
          </span>
        ) : null}
      </div>

      <div className="relative px-1">
        <div className="absolute left-[7%] right-[7%] top-4 h-1 rounded-full bg-default-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              cancelled ? "bg-red-500" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="relative grid grid-cols-4">
          {labels.map((label, index) => {
            const complete = !cancelled && index < activeIndex;
            const current = index === activeIndex;
            const active = complete || current;

            return (
              <li key={label} className="flex min-w-0 flex-col items-center">
                <span
                  className={`z-10 flex size-8 items-center justify-center rounded-full border text-[11px] font-semibold sm:size-10 sm:text-sm ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-default-300 bg-white text-default-500 dark:bg-default-50"
                  }`}
                >
                  {complete ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span
                  className={`mt-2 line-clamp-2 px-0.5 text-center text-[10px] leading-tight sm:text-xs ${
                    current
                      ? "font-semibold text-primary"
                      : "text-default-600"
                  }`}
                >
                  {label}
                  {current && !cancelled ? (
                    <span className="block text-[9px] text-primary sm:text-[10px]">
                      Active
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function TrackOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialReference = searchParams.get("orderId")?.trim() ?? "";
  const { user } = useContextApi();
  const { settings } = useBusinessSettings();
  const [reference, setReference] = useState(initialReference);
  const [order, setOrder] = useState<IOrderWithItems | null>(null);
  const [loading, setLoading] = useState(Boolean(initialReference));
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async (nextReference: string) => {
    const normalized = nextReference.trim();
    if (!normalized) {
      setOrder(null);
      setError("Enter your order number to continue.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/orders/track?reference=${encodeURIComponent(normalized)}`,
        { cache: "no-store" },
      );
      const data = (await response.json().catch(() => ({}))) as TrackOrderResponse;

      if (!response.ok || !data.success || !data.data?.order) {
        setOrder(null);
        setError(
          data.message ??
            "We couldn't find that order. Check the number and try again.",
        );
        return;
      }

      setOrder(data.data.order);
      setReference(data.data.order.order_number ?? data.data.order.id ?? normalized);
    } catch {
      setOrder(null);
      setError("We couldn't load your order right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialReference) return;
    const timer = window.setTimeout(() => {
      void loadOrder(initialReference);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialReference, loadOrder]);

  useOrdersRealtime({
    scope: user?.id ? { mode: "user", userId: user.id } : null,
    enabled: Boolean(user?.id && order?.id),
    onOrderUpdated: (updated) => {
      if (updated.id !== order?.id) return;
      setOrder((current) =>
        current ? { ...current, ...updated, items: current.items } : current,
      );
    },
  });

  const paymentStatus = order ? getPaymentStatus(order) : "pending";
  const bill = useMemo(() => {
    if (!order) return null;
    return getOrderBillSummary({
      subtotal: order.subtotal,
      discountAmount: order.discount_amount ?? 0,
      couponCode: order.coupon_code,
      fees: feeConfigForFulfillment(settings, order.fulfillment_type),
      lockedTotal: order.total,
    });
  }, [order, settings]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = reference.trim();
    if (!normalized) {
      setError("Enter your order number to continue.");
      return;
    }
    if (normalized === initialReference) {
      void loadOrder(normalized);
      return;
    }
    router.replace(`/track-order?orderId=${encodeURIComponent(normalized)}`);
  };

  return (
    <main className="min-h-dvh overflow-x-hidden bg-default-50 px-3 py-4 text-default-800 dark:bg-default-100 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/home"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-default-200 bg-white text-default-700 transition-colors hover:text-primary dark:bg-default-50"
            aria-label="Back to home"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </Link>
          <div className="min-w-0 text-center">
            <h1 className="text-lg font-bold text-default-900 sm:text-2xl">
              Track your order
            </h1>
            <p className="hidden text-xs text-default-500 sm:block">
              Live status, products and payment details
            </p>
          </div>
          <Link
            href="/user/orders"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-default-200 bg-white text-default-700 transition-colors hover:text-primary dark:bg-default-50"
            aria-label="View all orders"
          >
            <Package className="size-5" aria-hidden />
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-4 flex max-w-2xl gap-2"
        >
          <label className="sr-only" htmlFor="track-order-reference">
            Order number
          </label>
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400"
              aria-hidden
            />
            <input
              id="track-order-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Enter order number (e.g. YUM-260717-0002)"
              className="h-11 w-full rounded-xl border border-default-200 bg-white py-2 pl-10 pr-3 text-sm text-default-900 outline-none transition-colors placeholder:text-default-400 focus:border-primary dark:bg-default-50"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-60 sm:px-6"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "Track"
            )}
          </button>
        </form>

        {error ? (
          <div
            className="mx-auto mb-4 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading && !order ? (
          <div className="flex min-h-[55vh] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading order" />
          </div>
        ) : null}

        {!loading && !order && !error ? (
          <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center text-center">
            <span className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="size-8" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold text-default-900">
              Find your order
            </h2>
            <p className="mt-1 text-sm text-default-500">
              Enter the order number from your confirmation to see live updates.
            </p>
          </div>
        ) : null}

        {order && bill ? (
          <article className="rounded-2xl border border-default-200 bg-white p-3 shadow-lg dark:bg-default-50 sm:p-5 lg:p-6">
            <div className="mb-4 flex flex-col gap-3 border-b border-default-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs text-default-500">Order number</p>
                <h2 className="truncate text-base font-bold text-default-900 sm:text-xl">
                  {order.order_number ?? order.id}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-default-500">
                  <Clock3 className="size-3.5" aria-hidden />
                  Placed {formatOrderDate(order.created_at)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${statusPillClass(paymentStatus)}`}
                >
                  {paymentStatus === "paid" ? <Check className="size-3.5" /> : null}
                  {PAYMENT_STATUS_LABELS[paymentStatus]}
                </span>
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
                  {order.status}
                </span>
                <strong className="ml-auto text-xl font-bold tabular-nums text-default-900 sm:ml-3 sm:text-2xl">
                  {formatCurrency(order.total)}
                </strong>
              </div>
            </div>

            <div className="mb-5 grid gap-2 sm:grid-cols-3 sm:gap-3">
              <DetailCard icon={Package} title="Order">
                <p>
                  Type:{" "}
                  <strong className="text-default-900">
                    {FULFILLMENT_LABELS[order.fulfillment_type]}
                  </strong>
                </p>
                <p>
                  Items:{" "}
                  <strong className="text-default-900">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </strong>
                </p>
              </DetailCard>

              <DetailCard icon={CreditCard} title="Payment">
                <p>
                  Method:{" "}
                  <strong className="text-default-900">
                    {PAYMENT_LABELS[order.payment_method]}
                  </strong>
                </p>
                <p>
                  Status:{" "}
                  <strong
                    className={
                      paymentStatus === "paid"
                        ? "text-emerald-600"
                        : paymentStatus === "failed"
                          ? "text-red-600"
                          : "text-amber-600"
                    }
                  >
                    {PAYMENT_STATUS_LABELS[paymentStatus]}
                  </strong>
                </p>
              </DetailCard>

              <DetailCard
                icon={
                  order.fulfillment_type === FULFILLMENT_TYPE.DELIVERY
                    ? MapPin
                    : order.fulfillment_type === FULFILLMENT_TYPE.PICKUP
                      ? Store
                      : Utensils
                }
                title={FULFILLMENT_LABELS[order.fulfillment_type]}
              >
                {order.fulfillment_type === FULFILLMENT_TYPE.DELIVERY ? (
                  <p className="break-words">
                    {order.delivery_address || "Address unavailable"}
                  </p>
                ) : order.fulfillment_type === FULFILLMENT_TYPE.DINE_IN ? (
                  <p>
                    Table:{" "}
                    <strong className="text-default-900">
                      {order.table_number || "—"}
                    </strong>
                  </p>
                ) : (
                  <p>Collect your order from the restaurant counter.</p>
                )}
                {order.customer_phone ? <p>{order.customer_phone}</p> : null}
              </DetailCard>
            </div>

            <div className="mb-5">
              <OrderTimeline order={order} />
            </div>

            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
              <section className="min-w-0 overflow-hidden rounded-xl border border-default-200">
                <h2 className="border-b border-default-200 bg-default-50 px-3 py-2.5 text-sm font-semibold text-default-900 dark:bg-default-100">
                  Products ({order.items.length})
                </h2>
                <div className="divide-y divide-default-200">
                  {order.items.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-default-500">
                      No products found for this order.
                    </p>
                  ) : (
                    order.items.map((item) => (
                      <div
                        key={item.id ?? `${item.product_id}-${item.product_name}`}
                        className="flex min-w-0 items-center gap-3 p-2.5 sm:p-3"
                      >
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-default-100 sm:size-14">
                          <img
                            src={item.image_url || "/images/dishes/pizza.png"}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-default-900 sm:text-sm">
                            {item.product_name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-default-500 sm:text-xs">
                            Qty {item.quantity} × {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <strong className="shrink-0 text-xs tabular-nums text-default-900 sm:text-sm">
                          {formatCurrency(item.quantity * item.unit_price)}
                        </strong>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-default-200 p-3 sm:p-4">
                <h2 className="mb-1 text-sm font-semibold text-default-900">
                  Order Summary
                </h2>
                <OrderSummaryBreakdown
                  bill={bill}
                  mode="final"
                  showHints={false}
                  showDeliveryFee={order.fulfillment_type === FULFILLMENT_TYPE.DELIVERY}
                />
              </section>
            </div>

            <footer
              className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-center text-xs font-medium ${
                paymentStatus === "paid"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : paymentStatus === "failed"
                    ? "bg-red-500/10 text-red-700 dark:text-red-400"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {paymentStatus === "paid"
                ? "Payment successful"
                : paymentStatus === "failed"
                  ? "Payment failed"
                  : "Payment pending"}
              <span aria-hidden>•</span>
              {order.status === "completed"
                ? "Order completed"
                : order.status === "cancelled"
                  ? "Order cancelled"
                  : "Live status updates enabled"}
              <ChevronRight className="size-3.5" aria-hidden />
            </footer>
          </article>
        ) : null}
      </div>
    </main>
  );
}
