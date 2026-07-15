"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import OrderSummary from "@/components/common/OrderSummary";
import { useBusinessSettings } from "@/context-api/business-settings-context";
import {
  feeConfigForFulfillment,
  getOrderBillSummary,
} from "@/lib/cart/totals";
import Badge from "@/components/ui/Badge";
import { type BadgeColor } from "@/lib/badge-colors";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import { formatOrderIdShort } from "@/lib/orders/order-number";
import {
  getOrderStatusLabel,
  getOrderStatusOptions,
  getTimelineLabels,
} from "@/lib/orders/status-label";
import { getOrderPaymentStatus } from "@/lib/supabase/orders";
import type {
  FulfillmentType,
  IOrderItem,
  IOrderWithItems,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/order";

export { formatOrderIdShort };
export { getOrderStatusLabel, getOrderStatusOptions, getTimelineLabels };


export const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
  dine_in: "Dine in",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash_on_delivery: "Cash on delivery",
  pay_at_counter: "Pay at counter",
  pay_at_table: "Pay at table",
  online: "Online",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, BadgeColor> = {
  pending: "amber",
  confirmed: "blue",
  processing: "violet",
  cancelled: "red",
  completed: "green",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, BadgeColor> = {
  pending: "amber",
  paid: "green",
  failed: "red",
};

/** True when a value should be shown to admins (hides empty / placeholder "-"). */
export function hasValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed !== "-";
}

export function displayValue(value: string | number | null | undefined) {
  if (!hasValue(value)) return "—";
  return String(value);
}

export function getItemsSummary(items: IOrderItem[]) {
  if (items.length === 0) return "No items";
  const first = items[0].product_name;
  if (items.length === 1) return first;
  return `${first} +${items.length - 1} more`;
}

/** Compact customer/fulfillment label for table rows. */
export function getOrderCustomerSummary(order: IOrderWithItems): {
  primary: string;
  secondary?: string;
} | null {
  const phone = hasValue(order.customer_phone) ? order.customer_phone.trim() : null;

  if (order.fulfillment_type === "delivery") {
    const address = hasValue(order.delivery_address)
      ? order.delivery_address!.trim()
      : null;
    if (!phone && !address) return null;
    return {
      primary: phone ?? "Delivery",
      secondary: address ?? undefined,
    };
  }

  if (order.fulfillment_type === "pickup") {
    if (!phone) return null;
    return { primary: phone, secondary: "Pickup" };
  }

  const table = hasValue(order.table_number)
    ? `Table ${order.table_number!.trim()}`
    : null;

  if (!table && !phone) return null;
  return {
    primary: table ?? "Dine in",
    secondary: "Dine in",
  };
}

export function StatusBadge({
  title,
  label,
  color,
}: {
  title: string;
  label: string;
  color: BadgeColor;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-default-500">{title}</span>
      <Badge color={color} size="sm">
        {label}
      </Badge>
    </div>
  );
}

export function DetailField({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-default-500 mb-0.5">{label}</p>
      <p
        className={`text-sm text-default-800 break-words ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

/** Renders a detail field only when the raw value is present. */
export function OptionalDetailField({
  label,
  value,
  display,
  mono,
}: {
  label: string;
  value: string | number | null | undefined;
  display?: ReactNode;
  mono?: boolean;
}) {
  if (!hasValue(value)) return null;
  return (
    <DetailField label={label} value={display ?? String(value)} mono={mono} />
  );
}

export function DetailSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-default-200 bg-white p-4 dark:bg-default-50/40 ${className}`}>
      <h5 className="text-sm font-semibold text-default-900 mb-3">{title}</h5>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}

export function FulfillmentDetails({ order }: { order: IOrderWithItems }) {
  const phone = hasValue(order.customer_phone) ? order.customer_phone.trim() : null;
  const address = hasValue(order.delivery_address)
    ? order.delivery_address!.trim()
    : null;
  const pickupTime = hasValue(order.pickup_time) ? order.pickup_time! : null;
  const tableNumber = hasValue(order.table_number)
    ? order.table_number!.trim()
    : null;
  const partySize = hasValue(order.party_size) ? order.party_size!.trim() : null;

  if (order.fulfillment_type === "delivery") {
    if (!phone && !address) return null;
    return (
      <DetailSection title="Delivery">
        <OptionalDetailField label="Phone" value={phone} mono />
        <OptionalDetailField label="Address" value={address} />
      </DetailSection>
    );
  }

  if (order.fulfillment_type === "pickup") {
    if (!phone && !pickupTime) return null;
    return (
      <DetailSection title="Pickup">
        <OptionalDetailField label="Phone" value={phone} mono />
        {pickupTime ? (
          <DetailField
            label="Pickup time"
            value={formatCustomerSince(pickupTime)}
          />
        ) : null}
      </DetailSection>
    );
  }

  if (!tableNumber && !partySize && !phone) return null;

  return (
    <DetailSection title="Dine in">
      <OptionalDetailField label="Table number" value={tableNumber} />
      <OptionalDetailField label="Party size" value={partySize} />
      <OptionalDetailField label="Phone" value={phone} mono />
    </DetailSection>
  );
}

export function OrderLineItem({ item }: { item: IOrderItem }) {
  const imageSrc = item.image_url?.trim();
  const lineTotal = item.quantity * item.unit_price;

  return (
    <tr className="border-b border-default-100 last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-default-200 bg-default-50">
            <img
              src={imageSrc}
              alt={item.product_name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-default-900 break-words">
              {item.product_name}
            </p>
            {hasValue(item.product_id) ? (
              <p className="mt-0.5 font-mono text-[11px] text-default-400 truncate">
                {item.product_id}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-default-700 tabular-nums">
        {formatCurrency(item.unit_price)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-default-700 tabular-nums">
        ×{item.quantity}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-default-900 text-end tabular-nums">
        {formatCurrency(lineTotal)}
      </td>
    </tr>
  );
}

type TimelineStep = {
  label: string;
  state: "complete" | "current" | "upcoming";
};

const STATUS_STEP_INDEX: Record<Exclude<OrderStatus, "cancelled">, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  completed: 3,
};

function getTimelineStepsFromStatus(
  status: OrderStatus,
  fulfillment: FulfillmentType,
): TimelineStep[] {
  const labels = getTimelineLabels(fulfillment);

  if (status === "cancelled") {
    return labels.map((label, index) => ({
      label,
      state: index === 0 ? "complete" : "upcoming",
    }));
  }

  if (status === "completed") {
    return labels.map((label) => ({
      label,
      state: "complete",
    }));
  }

  const activeIndex = STATUS_STEP_INDEX[status];

  return labels.map((label, index) => ({
    label,
    state:
      index < activeIndex
        ? "complete"
        : index === activeIndex
          ? "current"
          : "upcoming",
  }));
}

function getTimelineProgress(steps: TimelineStep[]) {
  const currentIndex = steps.findIndex((step) => step.state === "current");
  const lastCompleteIndex = steps.reduce(
    (index, step, stepIndex) => (step.state === "complete" ? stepIndex : index),
    -1,
  );
  const activeIndex = currentIndex >= 0 ? currentIndex : lastCompleteIndex;
  const progress =
    steps.length <= 1 ? 100 : (activeIndex / (steps.length - 1)) * 100;

  return { activeIndex, progress };
}

function TimelineStepIndicator({
  step,
  index,
}: {
  step: TimelineStep;
  index: number;
}) {
  if (step.state === "complete") {
    return (
      <div className="bg-primary rounded-full text-white w-10 h-10 flex justify-center items-center">
        <Check className="h-5 w-5" aria-hidden />
      </div>
    );
  }

  if (step.state === "current") {
    return (
      <div className="bg-primary rounded-full w-10 h-10 flex justify-center items-center">
        <span className="text-sm font-medium text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-sm border border-dashed border-primary rounded-full w-10 h-10 flex justify-center items-center">
      <span className="text-sm font-medium text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function OrderTimeline({
  status,
  fulfillment,
}: {
  status: OrderStatus;
  fulfillment: FulfillmentType;
}) {
  const steps = getTimelineStepsFromStatus(status, fulfillment);
  const { progress } = getTimelineProgress(steps);
  const isCancelled = status === "cancelled";
  const progressColor = isCancelled ? "bg-red-500" : "bg-primary";

  return (
    <div>
      {isCancelled ? (
        <p className="mb-2 text-center text-sm font-medium text-red-500">
          This order was cancelled.
        </p>
      ) : null}

      <div className="relative my-10">
        <div className="md:flex hidden mx-20 -mb-6">
          <div className="flex w-full h-1.5 bg-default-200 rounded-full overflow-hidden">
            <div
              className={`flex flex-col justify-center overflow-hidden rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="absolute inset-y-0 start-[3.75rem] -translate-x-1/2 md:hidden flex">
          <div className="absolute inset-y-0 start-1/2 -translate-x-1/2 flex h-full w-1.5 bg-default-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 start-1/2 -translate-x-1/2 w-1.5 flex flex-col justify-center overflow-hidden rounded-full transition-all duration-300 ${progressColor}`}
              style={{ height: `${progress}%` }}
            />
          </div>
        </div>

        <div className="relative z-10 mx-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex flex-col items-start justify-center md:items-center"
            >
              <TimelineStepIndicator step={step} index={index} />
              <h4 className="mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none">
                {step.label}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type OrderDetailsPanelProps = {
  order: IOrderWithItems;
  className?: string;
};

export function OrderDetailsPanel({ order, className = "" }: OrderDetailsPanelProps) {
  const { settings } = useBusinessSettings();
  const items = order.items ?? [];
  const paymentStatus = getOrderPaymentStatus(order);
  const bill = getOrderBillSummary({
    subtotal: order.subtotal,
    discountAmount: order.discount_amount ?? 0,
    couponCode: order.coupon_code,
    fees: feeConfigForFulfillment(settings, order.fulfillment_type),
    lockedTotal: order.total,
  });
  const hasNotes = hasValue(order.additional_notes);
  const hasRazorpayIds =
    order.payment_method === "online" &&
    (hasValue(order.razorpay_order_id) || hasValue(order.razorpay_payment_id));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
        <DetailSection title="Order">
          <OptionalDetailField
            label="Order ID"
            value={order.order_number ?? order.id}
            display={formatOrderIdShort(order)}
            mono
          />
          <DetailField
            label="Type"
            value={FULFILLMENT_LABELS[order.fulfillment_type]}
          />
          {order.created_at ? (
            <DetailField
              label="Placed"
              value={formatCustomerSince(order.created_at)}
            />
          ) : null}
          {order.updated_at ? (
            <DetailField
              label="Last updated"
              value={formatCustomerSince(order.updated_at)}
            />
          ) : null}
          <DetailField
            label="Items"
            value={`${items.length} line${items.length === 1 ? "" : "s"} · ${itemCount} qty`}
          />
        </DetailSection>

        <DetailSection title="Payment">
          <DetailField
            label="Method"
            value={PAYMENT_METHOD_LABELS[order.payment_method]}
          />
          <div className="min-w-0">
            <p className="text-xs text-default-500 mb-0.5">Status</p>
            <Badge color={paymentStatus.color} size="sm">
              {paymentStatus.label}
            </Badge>
          </div>
          {hasRazorpayIds ? (
            <>
              <OptionalDetailField
                label="Razorpay order ID"
                value={order.razorpay_order_id}
                mono
              />
              <OptionalDetailField
                label="Razorpay payment ID"
                value={order.razorpay_payment_id}
                mono
              />
            </>
          ) : null}
        </DetailSection>

        <FulfillmentDetails order={order} />
      </div>

      {hasNotes ? (
        <div className="rounded-lg border border-default-200 bg-white p-4 dark:bg-default-50/40">
          <h5 className="text-sm font-semibold text-default-900 mb-2">
            Order notes
          </h5>
          <p className="text-sm text-default-700 whitespace-pre-wrap break-words">
            {order.additional_notes!.trim()}
          </p>
        </div>
      ) : null}

      <OrderTimeline
        status={order.status ?? "pending"}
        fulfillment={order.fulfillment_type}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-default-200 overflow-hidden bg-white dark:bg-default-50/40">
          <div className="px-4 py-3 border-b border-default-200 bg-default-50">
            <h5 className="text-sm font-semibold text-default-900">
              Products ({items.length})
            </h5>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-default-400">No items</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-default-100">
                    <th className="px-10 py-2.5 text-xs font-medium text-default-500 text-start">
                      Product
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-default-500 text-start">
                      Price
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-default-500 text-start">
                      Qty
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-default-500 text-end">
                      Line total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <OrderLineItem
                      key={
                        item.id ??
                        `${order.id}-${item.product_id}-${item.product_name}`
                      }
                      item={item}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <OrderSummary
          bill={bill}
          className="h-fit"
          showHints
          showDeliveryFee={order.fulfillment_type === "delivery"}
        />
      </div>
    </div>
  );
}
