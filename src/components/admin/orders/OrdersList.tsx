"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Banknote, Filter, ShoppingBag, Wallet } from "lucide-react";
import OrderExpandableTableRow from "@/components/admin/orders/OrderExpandableTableRow";
import OrderFiltersModal from "@/components/admin/orders/OrderFiltersModal";
import AnonymousUpgradeBanner from "@/components/storefront/AnonymousUpgradeBanner";
import { StatsCardsSkeleton, TableSkeleton } from "@/components/skeleton";
import { formatCurrency } from "@/lib/constants";
import { formatOrderIdShort } from "@/lib/orders/order-number";
import {
  countActiveOrderListFilters,
  DEFAULT_ORDER_LIST_FILTERS,
  formatOrderListFiltersLabel,
  type OrderListFilters,
} from "@/lib/supabase/orders";

import { UserRole } from "@/types/user";
import { useOrders } from "@/hooks/orders/use-orders";
import type { IOrderWithItems } from "@/types/order";

const DEFAULT_LIMIT = 10;

export default function OrdersList({ userRole }: { userRole: UserRole }) {
  const [filters, setFilters] = useState<OrderListFilters>(DEFAULT_ORDER_LIST_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isAdmin = userRole === UserRole.ADMIN;
  const {
    orders,
    loading,
    error,
    total,
    totalPages,
    stats,
    updateOrderStatus,
    refreshOrders,
    recentRealtimeOrderIds,
  } = useOrders(filters, userRole, page, DEFAULT_LIMIT);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleDeleteOrder = async (order: IOrderWithItems) => {
    if (!isAdmin || !order.id) return;
    const confirmed = window.confirm(
      `Delete order ${formatOrderIdShort(order)}…? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(order.id);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Failed to delete order.");
        return;
      }
      toast.success(data.message ?? "Order deleted.");
      if (orders.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        refreshOrders();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const activeFilterLabel = formatOrderListFiltersLabel(filters);
  const activeFilterCount = countActiveOrderListFilters(filters);

  const startItem = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const endItem = Math.min(page * DEFAULT_LIMIT, total);

  const displayStats = stats ?? {
    totalOrders: total,
    paidRevenue: 0,
    pendingCount: 0,
  };

  return (
    <div className="space-y-6">
      {!isAdmin ? <AnonymousUpgradeBanner /> : null}
      {isAdmin ? (
        loading ? (
          <StatsCardsSkeleton />
        ) : (
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 overflow-hidden border-default-200">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/20 text-primary h-16 w-16">
                  <ShoppingBag className="h-8 w-8" aria-hidden />
                </div>
                <div>
                  <p className="text-base text-default-500 font-medium mb-1">
                    Total Orders
                  </p>
                  <h4 className="text-2xl text-default-950 font-semibold mb-2">
                    {displayStats.totalOrders}
                  </h4>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 overflow-hidden border-default-200">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 h-16 w-16">
                  <Wallet className="h-8 w-8" aria-hidden />
                </div>
                <div>
                  <p className="text-base text-default-500 font-medium mb-1">
                    Paid Revenue
                  </p>
                  <h4 className="text-2xl text-default-950 font-semibold mb-2">
                    {formatCurrency(displayStats.paidRevenue)}
                  </h4>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 overflow-hidden border-default-200">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center rounded-full bg-green-500/20 text-green-500 h-16 w-16">
                  <Banknote className="h-8 w-8" aria-hidden />
                </div>
                <div>
                  <p className="text-base text-default-500 font-medium mb-1">
                    Pending Payment
                  </p>
                  <h4 className="text-2xl text-default-950 font-semibold mb-2">
                    {displayStats.pendingCount}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

      <div className="border rounded-lg border-default-200">
        <div className="p-6 overflow-hidden">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
            <h2 className="text-xl text-default-800 font-semibold">All Orders</h2>

            <div className="flex items-center">
              <span className="text-base text-default-950 me-3">Filter :</span>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 font-medium text-default-950 text-sm py-2.5 px-4 xl:px-5 rounded-full border border-default-200 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <Filter className="h-4 w-4" aria-hidden />
                {activeFilterLabel}
                {activeFilterCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          {loading ? (
            <TableSkeleton
              columns={isAdmin ? 8 : 7}
              rows={DEFAULT_LIMIT}
              className="px-2"
            />
          ) : error ? (
            <p className="px-6 py-8 text-sm text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-default-500">No orders found.</p>
          ) : (
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-100">
                <tr className="text-start">
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                    Date
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800 min-w-[12rem]">
                    Products
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800 min-w-[10rem]">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800 min-w-[10rem]">
                    Order Status
                  </th>
                  {userRole === UserRole.ADMIN ? (
                    <th className="px-6 py-3 text-end text-sm whitespace-nowrap font-medium text-default-800">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>

              <tbody className="divide-y divide-default-200">
                {orders.map((order, index) => (
                  <OrderExpandableTableRow
                    key={order.id}
                    order={order}
                    columnCount={isAdmin ? 8 : 7}
                    userRole={userRole}
                    defaultExpanded={index === 0}
                    isRealtimeNew={
                      order.id ? recentRealtimeOrderIds.has(order.id) : false
                    }
                    onStatusUpdated={updateOrderStatus}
                    onPaymentUpdated={refreshOrders}
                    onDelete={isAdmin ? handleDeleteOrder : undefined}
                    isDeleting={order.id ? deletingId === order.id : false}
                  />
                ))}
              </tbody>
            </table>
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
      <OrderFiltersModal
        open={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={setFilters}
      />
    </div>
  );
}