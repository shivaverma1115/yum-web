"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Eye } from "lucide-react";
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
import { UserRole } from "@/types/user";

type OrderExpandableTableRowProps = {
  order: IOrderWithItems;
  columnCount: number;
  userRole: UserRole;
  onStatusUpdated?: (orderId: string, status: OrderStatus) => void;
};

export default function OrderExpandableTableRow({
  order,
  columnCount,
  userRole,
  onStatusUpdated,
}: OrderExpandableTableRowProps) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items ?? [];
  const firstItem = items[0];
  const imageSrc = firstItem?.image_url?.trim() || PLACEHOLDER_IMAGE;
  const paymentStatus = getOrderPaymentStatus(order);

  const toggleExpanded = () => setExpanded((open) => !open);

  return (
    <>
      <tr
        className={`cursor-pointer transition-colors ${expanded ? "bg-default-50/80" : "hover:bg-default-50/80"}`}
        onClick={toggleExpanded}
        aria-expanded={expanded}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-default-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            />
            {formatCustomerSince(order.created_at)}
          </div>
        </td>
        <td
          className="px-6 py-4 text-sm font-medium text-default-500 font-mono"
          title={order.id}
        >
          <span className="block max-w-[10rem] truncate">
            {formatOrderIdShort(order.id)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
          {/* <p>
            {getCustomerName(order)}
          </p>
          <p className="text-xs text-default-500 mt-0.5">{order.customer_email}</p> */}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
          <div className="flex items-center gap-4">
            <div className="shrink">
              <div className="h-11 w-11 overflow-hidden rounded border border-default-200">
                <img
                  src={imageSrc}
                  alt={firstItem?.product_name ?? "Order item"}
                  className="max-w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grow min-w-0">
              <p className="text-sm text-default-500 truncate">
                {getItemsSummary(items)}
              </p>
              <p className="text-xs text-default-400 mt-0.5 capitalize">
                {order.fulfillment_type.replace("_", " ")}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">
          {formatCurrency(order.total)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">
          <Badge color={paymentStatus.color}>{paymentStatus.label}</Badge>
        </td>
        <td
          className="relative z-10 px-6 py-4"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          {userRole === UserRole.ADMIN && order.id && onStatusUpdated ? (
            <OrderStatusDropdown
              orderId={order.id}
              status={order.status as OrderStatus}
              fulfillment={order.fulfillment_type}
              onStatusUpdated={onStatusUpdated}
            />
          ) : (
            <Badge color={ORDER_STATUS_COLORS[order.status ?? "pending"]}>
              {getOrderStatusLabel(order.status ?? "pending", order.fulfillment_type)}
            </Badge>
          )}
        </td>
        {order.id && userRole === UserRole.ADMIN ? (
          <td className="px-6 py-4 text-end">
            <Link
              href={`/admin/orders/${order.id}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full text-default-600 hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label={`View order ${formatOrderIdShort(order.id)}`}
            >
              <Eye className="h-4 w-4" aria-hidden />
            </Link>
          </td>
        ) : null}
      </tr>

      <tr className="bg-default-50/40">
        <td colSpan={columnCount} className="p-0 border-b border-default-200">
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              <OrderDetailsPanel
                order={order}
                className="px-6 py-5 border-t border-default-100"
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
