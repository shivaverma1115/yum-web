"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { type CustomerOrdersFilter } from "@/lib/supabase/orders";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import { useAdminCustomerOrders } from "@/hooks/use-admin-customer-orders";
import type { IOrderWithItems, OrderStatus, PaymentStatus } from "@/types/order";
import {
  formatOrderIdShort,
  FULFILLMENT_LABELS,
  getItemsSummary,
  ORDER_STATUS_COLORS,
  OrderDetailsPanel,
  PAYMENT_STATUS_COLORS,
  StatusBadge,
} from "@/components/admin/orders/order-details-shared";
import { SkeletonList } from "@/components/skeleton";

const DEFAULT_LIMIT = 10;

const FILTER_OPTIONS: { value: CustomerOrdersFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "failed", label: "Failed" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
];

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
                title="Order Status"
                label={orderStatus}
                color={ORDER_STATUS_COLORS[orderStatus as OrderStatus]}
              />
              <StatusBadge
                title="Payment Status"
                label={paymentStatus}
                color={PAYMENT_STATUS_COLORS[paymentStatus as PaymentStatus]}
              />
            </div>
            <ChevronDown
              className={`h-5 w-5 text-default-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            />
          </div>
        </div>
        <p className="text-xs text-primary mt-2">
          {expanded ? "Hide order details" : "View order details"}
        </p>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <OrderDetailsPanel
            order={order}
            className="px-6 pb-5 pt-0 border-t border-default-100"
          />
        </div>
      </div>
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
  const [page, setPage] = useState(1);
  const { orders, loading, error, total, totalPages } = useAdminCustomerOrders(
    userId,
    filter,
    page,
    DEFAULT_LIMIT,
  );

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const activeLabel =
    FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? "All";
  const startItem = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const endItem = Math.min(page * DEFAULT_LIMIT, total);

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
                        className={`w-full text-start flex items-center gap-3 font-normal py-2 px-3 transition-all rounded ${filter === option.value
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
          <div className="p-4">
            <SkeletonList rows={DEFAULT_LIMIT} showTrailing />
          </div>
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

      {!loading && !error && total > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-default-200 px-6 py-4">
          <p className="text-sm text-default-500">
            Showing {startItem}–{endItem} of {total} orders
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-md px-4 py-2 text-sm font-medium text-default-700 bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            <span className="text-sm text-default-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md px-4 py-2 text-sm font-medium text-default-700 bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
