"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { type CustomerOrdersFilter } from "@/lib/supabase/orders";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import { useAdminCustomerOrders } from "@/hooks/use-admin-customer-orders";
import type {
  FulfillmentType,
  IOrderItem,
  IOrderWithItems,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/order";

const FILTER_OPTIONS: { value: CustomerOrdersFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "failed", label: "Failed" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
];

const PLACEHOLDER_IMAGE = "/images/dishes/small/pizza.png";

const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
  dine_in: "Dine in",
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash_on_delivery: "Cash on delivery",
  pay_at_counter: "Pay at counter",
  pay_at_table: "Pay at table",
  online: "Online",
};

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/20 text-amber-600",
  confirmed: "bg-blue-500/20 text-blue-600",
  cancelled: "bg-red-500/20 text-red-500",
  completed: "bg-green-500/20 text-green-600",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-amber-500/20 text-amber-600",
  paid: "bg-green-500/20 text-green-600",
  failed: "bg-red-500/20 text-red-500",
};

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && !value.trim()) return "—";
  return String(value);
}

function formatOrderIdShort(orderId?: string) {
  if (!orderId) return "—";
  return `#${orderId.slice(0, 8).toUpperCase()}`;
}

function getItemsSummary(items: IOrderItem[]) {
  if (items.length === 0) return "No items";
  const first = items[0].product_name;
  if (items.length === 1) return first;
  return `${first} +${items.length - 1} more`;
}

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium capitalize ${className}`}
    >
      {label}
    </span>
  );
}

function DetailField({
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

function DetailSection({
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

function OrderLineItem({ item }: { item: IOrderItem }) {
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
        <DetailField label="Product" value={item.product_name} />
        <DetailField label="Quantity" value={item.quantity} />
        <DetailField label="Unit price" value={formatCurrency(item.unit_price)} />
        <DetailField label="Line total" value={formatCurrency(lineTotal)} />
        <DetailField label="Product ID" value={displayValue(item.product_id)} mono />
        <DetailField label="Line item ID" value={displayValue(item.id)} mono />
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

function FulfillmentDetails({ order }: { order: IOrderWithItems }) {
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

function OrderCard({ order }: { order: IOrderWithItems }) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items ?? [];
  const orderStatus = order.status ?? "pending";
  const paymentStatus = order.payment_status ?? "pending";

  return (
    <article className="border-b border-default-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="w-full px-6 py-4 text-start hover:bg-default-50/80 transition-colors"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-default-900">
                {formatCustomerSince(order.created_at)}
              </p>
              <span className="text-xs font-mono text-default-500">
                {formatOrderIdShort(order.id)}
              </span>
            </div>
            <p className="text-sm text-default-600 mt-1 truncate">
              {getItemsSummary(items)}
            </p>
            <p className="text-sm font-medium text-default-800 mt-1">
              {formatCurrency(order.total)}
              <span className="text-default-500 font-normal ms-2">
                · {FULFILLMENT_LABELS[order.fulfillment_type]}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-wrap gap-2 justify-end">
              <StatusBadge
                label={orderStatus}
                className={ORDER_STATUS_STYLES[orderStatus]}
              />
              <StatusBadge
                label={paymentStatus}
                className={PAYMENT_STATUS_STYLES[paymentStatus]}
              />
            </div>
            <ChevronDown
              className={`h-5 w-5 text-default-500 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </div>
        </div>
        <p className="text-xs text-primary mt-2">
          {expanded ? "Hide order details" : "View order details"}
        </p>
      </button>

      {expanded ? (
        <div className="px-6 pb-5 pt-0 border-t border-default-100">
      <div className="grid lg:grid-cols-2 gap-4 mb-4 mt-4">
        <DetailSection title="Order">
          <DetailField
            label="Order ID"
            value={displayValue(order.id)}
            mono
          />
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
          <DetailField label="User ID" value={displayValue(order.user_id)} mono />
          <DetailField
            label="Updated at"
            value={
              order.updated_at
                ? formatCustomerSince(order.updated_at)
                : "—"
            }
          />
        </DetailSection>

        <DetailSection title="Customer">
          <DetailField
            label="Name"
            value={`${order.customer_first_name} ${order.customer_last_name}`.trim() || "—"}
          />
          <DetailField label="Email" value={displayValue(order.customer_email)} />
          <DetailField label="Phone" value={displayValue(order.customer_phone)} />
          <DetailField
            label="Notes"
            value={displayValue(order.additional_notes)}
          />
        </DetailSection>

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

        <FulfillmentDetails order={order} />
      </div>

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
      ) : null}
    </article>
  );
}

interface CustomerOrderHistoryProps {
  userId: string;
}

export default function CustomerOrderHistory({
  userId,
}: CustomerOrderHistoryProps) {
  const [filter, setFilter] = useState<CustomerOrdersFilter>("all");
  const { orders, loading, error } = useAdminCustomerOrders(userId, filter);

  const activeLabel =
    FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? "All";

  return (
    <div className="border rounded-lg border-default-200">
      <div className="px-6 py-4">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <h4 className="text-xl font-medium text-default-900">
            Customer Order history
          </h4>

          <div className="flex items-center">
            <span className="text-base text-default-950 me-3">Sort By :</span>

            <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
              <button
                type="button"
                className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-950 text-sm py-2.5 px-4 xl:px-5 rounded-lg border border-default-200 transition-all"
              >
                {activeLabel}{" "}
                <ChevronDown className="h-4 w-4" aria-hidden />
              </button>

              <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white dark:bg-default-50 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5">
                <ul className="flex flex-col gap-1">
                  {FILTER_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => setFilter(option.value)}
                        className={`w-full text-start flex items-center gap-3 font-normal py-2 px-3 transition-all rounded ${
                          filter === option.value
                            ? "text-default-700 bg-default-400/20"
                            : "text-default-600 hover:text-default-700 hover:bg-default-400/20"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="px-6 py-8 text-sm text-default-500">Loading orders…</p>
        ) : error ? (
          <p className="px-6 py-8 text-sm text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-default-500">
            No orders found for this customer.
          </p>
        ) : (
          <div className="divide-y divide-default-200">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
