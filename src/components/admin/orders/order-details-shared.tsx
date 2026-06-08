import type { ReactNode } from "react";
import { Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { type BadgeColor } from "@/lib/badge-colors";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import type {
  FulfillmentType,
  IOrderItem,
  IOrderWithItems,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/order";

export const PLACEHOLDER_IMAGE = "/images/dishes/small/pizza.png";

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

export function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && !value.trim()) return "—";
  return String(value);
}

export function formatOrderIdShort(orderId?: string) {
  if (!orderId) return "—";
  return `#${orderId.slice(0, 8).toUpperCase()}`;
}

export function getItemsSummary(items: IOrderItem[]) {
  if (items.length === 0) return "No items";
  const first = items[0].product_name;
  if (items.length === 1) return first;
  return `${first} +${items.length - 1} more`;
}

export function getCustomerName(order: IOrderWithItems) {
  const name = `${order.customer_first_name} ${order.customer_last_name}`.trim();
  return name || order.customer_email || "Guest";
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

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-default-200 p-4">
      <h5 className="text-sm font-medium text-default-900 mb-3">{title}</h5>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}

export function FulfillmentDetails({ order }: { order: IOrderWithItems }) {
  if (order.fulfillment_type === "delivery") {
    return (
      <DetailSection title="Delivery">
        <DetailField label="Address" value={displayValue(order.delivery_address)} />
        <DetailField label="City" value={displayValue(order.delivery_city)} />
        <DetailField label="State" value={displayValue(order.delivery_state)} />
        <DetailField label="Country" value={displayValue(order.delivery_country)} />
        <DetailField label="ZIP code" value={displayValue(order.delivery_zip_code)} />
      </DetailSection>
    );
  }

  if (order.fulfillment_type === "pickup") {
    return (
      <DetailSection title="Pickup">
        <DetailField
          label="Pickup time"
          value={
            order.pickup_time
              ? formatCustomerSince(order.pickup_time)
              : displayValue(order.pickup_time)
          }
        />
      </DetailSection>
    );
  }

  return (
    <DetailSection title="Dine in">
      <DetailField label="Table number" value={displayValue(order.table_number)} />
      <DetailField label="Party size" value={displayValue(order.party_size)} />
    </DetailSection>
  );
}

export function OrderLineItem({ item }: { item: IOrderItem }) {
  const imageSrc = item.image_url?.trim() || PLACEHOLDER_IMAGE;
  const lineTotal = item.quantity * item.unit_price;

  return (
    <div className="flex gap-4 py-3 border-b border-default-100 last:border-b-0">
      <div className="shrink">
        <div className="h-14 w-14 overflow-hidden rounded border border-default-200">
          <img
            src={imageSrc}
            alt={item.product_name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="grow min-w-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <DetailField label="Item ID" value={displayValue(item.id)} mono />
        <DetailField label="Product" value={item.product_name} />
        <DetailField label="Quantity" value={item.quantity} />
        <DetailField label="Unit price" value={formatCurrency(item.unit_price)} />
        <DetailField label="Line total" value={formatCurrency(lineTotal)} />
        {item.created_at ? (
          <DetailField
            label="Added at"
            value={formatCustomerSince(item.created_at)}
          />
        ) : null}
      </div>
    </div>
  );
}

type TimelineStep = {
  label: string;
  state: "complete" | "current" | "upcoming";
};

export function getTimelineLabels(fulfillment: FulfillmentType): string[] {
  if (fulfillment === "delivery") {
    return ["Pending", "Confirmed", "On the way", "Delivered"];
  }
  if (fulfillment === "pickup") {
    return ["Pending", "Confirmed", "Preparing", "Ready for pickup"];
  }
  return ["Pending", "Confirmed", "Preparing", "Served"];
}

const STATUS_STEP_INDEX: Record<Exclude<OrderStatus, "cancelled">, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  completed: 3,
};

export function getOrderStatusLabel(
  status: OrderStatus,
  fulfillment: FulfillmentType,
): string {
  if (status === "cancelled") return "Cancelled";

  const labels = getTimelineLabels(fulfillment);
  return labels[STATUS_STEP_INDEX[status]];
}

export function getOrderStatusOptions(fulfillment: FulfillmentType) {
  const labels = getTimelineLabels(fulfillment);

  return [
    { value: "pending" as const, label: labels[0] },
    { value: "confirmed" as const, label: labels[1] },
    { value: "processing" as const, label: labels[2] },
    { value: "completed" as const, label: labels[3] },
    { value: "cancelled" as const, label: "Cancelled" },
  ];
}

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
      <div className="bg-primary rounded-full text-white w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center shrink-0">
        <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      </div>
    );
  }

  if (step.state === "current") {
    return (
      <div className="bg-primary rounded-full w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center shrink-0">
        <span className="text-xs sm:text-sm font-medium text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className="border border-dashed border-primary rounded-full w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center shrink-0 bg-white dark:bg-default-50">
      <span className="text-xs sm:text-sm font-medium text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function getTimelineStepStatusLabel(
  step: TimelineStep,
  orderStatus: OrderStatus,
): string {
  if (orderStatus === "cancelled") {
    return step.state === "complete" ? "Cancelled" : "Skipped";
  }

  if (step.state === "complete") return "Completed";
  if (step.state === "current") return "In progress";
  return "Pending";
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
    <div className="rounded-lg border border-default-200 p-4 sm:p-6 mb-4">
      <h5 className="text-sm font-medium text-default-900 mb-6">Order Timeline</h5>

      {isCancelled ? (
        <p className="mb-4 text-sm font-medium text-red-500">
          This order was cancelled.
        </p>
      ) : null}

      {/* Horizontal layout — sm and up */}
      <div className="hidden sm:block">
        <div className="relative px-2 sm:px-4 lg:px-8">
          <div className="absolute top-5 inset-x-4 lg:inset-x-8 h-1.5 bg-default-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-y-0">
            {steps.map((step, index) => (
              <li
                key={step.label}
                className="flex flex-col items-center text-center min-w-0"
              >
                <TimelineStepIndicator step={step} index={index} />
                <p className="mt-3 text-xs sm:text-sm text-default-800 font-medium leading-snug px-1">
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Vertical layout — mobile */}
      <ol className="sm:hidden relative space-y-0 ps-1">
        <span
          className="absolute start-[1.125rem] top-5 bottom-5 w-0.5 bg-default-200 rounded-full"
          aria-hidden
        />
        <span
          className={`absolute start-[1.125rem] top-5 w-0.5 rounded-full transition-all duration-300 ${progressColor}`}
          style={{ height: `${progress}%`, maxHeight: "calc(100% - 2.5rem)" }}
          aria-hidden
        />

        {steps.map((step, index) => (
          <li key={step.label} className="relative flex items-start gap-4 pb-8 last:pb-0">
            <TimelineStepIndicator step={step} index={index} />
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="text-sm font-medium text-default-800">{step.label}</p>
              <p className="text-xs text-default-500 mt-0.5 capitalize">
                {getTimelineStepStatusLabel(step, status)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

type OrderDetailsPanelProps = {
  order: IOrderWithItems;
  className?: string;
};

export function OrderDetailsPanel({ order, className = "" }: OrderDetailsPanelProps) {
  const items = order.items ?? [];

  return (
    <div className={className}>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <DetailSection title="Order">
          <DetailField label="Order ID" value={displayValue(order.id)} mono />
          <DetailField
            label="Fulfillment"
            value={FULFILLMENT_LABELS[order.fulfillment_type]}
          />
          <DetailField
            label="Payment method"
            value={PAYMENT_METHOD_LABELS[order.payment_method]}
          />
          <DetailField label="Subtotal" value={formatCurrency(order.subtotal)} />
          <DetailField label="Total" value={formatCurrency(order.total)} />
          <DetailField
            label="Updated at"
            value={
              order.updated_at ? formatCustomerSince(order.updated_at) : "—"
            }
          />
        </DetailSection>

        {order.payment_method === "online" ? (
          <DetailSection title="Payment (Razorpay)">
            <DetailField
              label="Razorpay order ID"
              value={displayValue(order.razorpay_order_id)}
              mono
            />
            <DetailField
              label="Razorpay payment ID"
              value={displayValue(order.razorpay_payment_id)}
              mono
            />
          </DetailSection>
        ) : null}

        <FulfillmentDetails order={order} />

        <DetailSection title="Customer">
          <DetailField label="Name" value={getCustomerName(order)} />
          <DetailField label="Email" value={displayValue(order.customer_email)} />
          <DetailField label="Phone" value={displayValue(order.customer_phone)} />
        </DetailSection>
      </div>

      <OrderTimeline
        status={order.status ?? "pending"}
        fulfillment={order.fulfillment_type}
      />

      <div className="rounded-lg border border-default-200">
        <div className="px-4 py-3 border-b border-default-200 bg-default-50">
          <h5 className="text-sm font-medium text-default-900">
            Items ({items.length})
          </h5>
        </div>
        {items.length === 0 ? (
          <p className="px-4 py-6 text-sm text-default-400">No items</p>
        ) : (
          <div className="px-4">
            {items.map((item) => (
              <OrderLineItem
                key={
                  item.id ??
                  `${order.id}-${item.product_id}-${item.product_name}`
                }
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
