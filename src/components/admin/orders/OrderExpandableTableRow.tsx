"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Eye, Trash } from "lucide-react";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import { getOrderPaymentStatus } from "@/lib/supabase/orders";
import type { IOrderWithItems, OrderStatus } from "@/types/order";
import OrderStatusDropdown from "@/components/admin/orders/OrderStatusDropdown";
import Badge from "@/components/ui/Badge";
import {
  formatOrderIdShort,
  getItemsSummary,
  getOrderStatusLabel,
  ORDER_STATUS_COLORS,
  OrderDetailsPanel,
  PLACEHOLDER_IMAGE,
} from "@/components/admin/orders/order-details-shared";
import PayOrderButton from "@/components/storefront/PayOrderButton";
import { UserRole } from "@/types/user";

type OrderExpandableTableRowProps = {
  order: IOrderWithItems;
  columnCount: number;
  userRole: UserRole;
  isRealtimeNew?: boolean;
  onStatusUpdated?: (orderId: string, status: OrderStatus) => void;
  onPaymentUpdated?: () => void;
  onDelete?: (order: IOrderWithItems) => void;
  isDeleting?: boolean;
};

export default function OrderExpandableTableRow({
  order,
  columnCount,
  userRole,
  isRealtimeNew = false,
  onStatusUpdated,
  onPaymentUpdated,
  onDelete,
  isDeleting = false,
}: OrderExpandableTableRowProps) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items ?? [];
  const firstItem = items[0];
  const imageSrc = firstItem?.image_url?.trim() || PLACEHOLDER_IMAGE;
  const paymentStatus = getOrderPaymentStatus(order);
  const isAdmin = userRole === UserRole.ADMIN;
  const orderStatus = order.status ?? "pending";

  const toggleExpanded = () => setExpanded((open) => !open);

  const rowClassName = [
    "group cursor-pointer transition-colors duration-200",
    expanded ? "bg-default-50/90" : "hover:bg-default-50/70",
    isRealtimeNew ? "order-realtime-row" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <tr
        className={rowClassName}
        onClick={toggleExpanded}
        aria-expanded={expanded}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                expanded
                  ? "border-primary/25 bg-primary/10 text-primary"
                  : "border-default-200 bg-white text-default-500 group-hover:border-default-300 dark:bg-default-100/40"
              }`}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                aria-hidden
              />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-default-800">
                {formatCustomerSince(order.created_at)}
              </p>
              {isRealtimeNew ? (
                <span className="order-realtime-badge mt-1">New order</span>
              ) : null}
            </div>
          </div>
        </td>

        <td className="px-6 py-4" title={order.id}>
          <span className="inline-flex max-w-[10rem] truncate rounded-md bg-default-100 px-2.5 py-1 font-mono text-xs font-medium text-default-700 dark:bg-default-200/40">
            {formatOrderIdShort(order.id)}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-default-700">
          {order.customer_phone || "—"}
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-default-200 bg-default-50 shadow-sm">
              <img
                src={imageSrc}
                alt={firstItem?.product_name ?? "Order item"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-default-800">
                {getItemsSummary(items)}
              </p>
              <p className="mt-0.5 text-xs capitalize text-default-500">
                {order.fulfillment_type.replace("_", " ")}
              </p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-default-900">
          {formatCurrency(order.total)}
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <Badge color={paymentStatus.color}>{paymentStatus.label}</Badge>
        </td>

        <td
          className="relative z-10 px-6 py-4"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          {isAdmin && order.id && onStatusUpdated ? (
            <OrderStatusDropdown
              orderId={order.id}
              status={orderStatus as OrderStatus}
              fulfillment={order.fulfillment_type}
              onStatusUpdated={onStatusUpdated}
            />
          ) : (
            <Badge color={ORDER_STATUS_COLORS[orderStatus]}>
              {getOrderStatusLabel(orderStatus, order.fulfillment_type)}
            </Badge>
          )}
        </td>

        {order.id && isAdmin ? (
          <td
            className="px-6 py-4 text-end"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="inline-flex items-center justify-end gap-1">
              <Link
                href={`/admin/orders/${order.id}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-default-500 transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label={`View order ${formatOrderIdShort(order.id)}`}
              >
                <Eye className="h-4 w-4" aria-hidden />
              </Link>
              {onDelete ? (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onDelete(order)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  aria-label={`Delete order ${formatOrderIdShort(order.id)}`}
                >
                  <Trash className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>
          </td>
        ) : null}
      </tr>

      <tr
        className={
          isRealtimeNew ? "order-realtime-row-expanded" : "bg-default-50/30"
        }
      >
        <td colSpan={columnCount} className="border-b border-default-200 p-0">
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div
                className={`order-expandable-details ${
                  isRealtimeNew ? "order-realtime-panel" : ""
                }`}
              >
                {userRole === UserRole.USER ? (
                  <div
                    className="mb-4 flex justify-end border-b border-default-100 pb-4"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <PayOrderButton
                      order={order}
                      onPaymentUpdated={onPaymentUpdated}
                    />
                  </div>
                ) : null}

                <OrderDetailsPanel order={order} className="p-0" />
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
