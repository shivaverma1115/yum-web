"use client";

import { useMemo, useState } from "react";
import { Banknote, ChevronDown, ShoppingBag, Wallet } from "lucide-react";
import OrderExpandableTableRow from "@/components/admin/orders/OrderExpandableTableRow";
import { formatCurrency } from "@/lib/constants";
import { type CustomerOrdersFilter } from "@/lib/supabase/orders";
import { UserRole } from "@/types/user";
import { useOrders } from "@/hooks/orders/use-orders";

const FILTER_OPTIONS: { value: CustomerOrdersFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "failed", label: "Failed" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
];

const TABLE_COLUMN_COUNT = 7;

export default function OrdersList({ userRole }: { userRole: UserRole }) {
  const [filter, setFilter] = useState<CustomerOrdersFilter>("all");
  const { orders, loading, error, updateOrderStatus } = useOrders(filter, userRole);

  const activeLabel =
    FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? "All";

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const paidRevenue = orders
      .filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + order.total, 0);
    const pendingCount = orders.filter(
      (order) => order.payment_status === "pending" && order.status !== "cancelled",
    ).length;

    return { totalOrders, paidRevenue, pendingCount };
  }, [orders]);

  return (
    <div className="space-y-6">
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
                {loading ? "—" : stats.totalOrders}
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
                {loading ? "—" : formatCurrency(stats.paidRevenue)}
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
                {loading ? "—" : stats.pendingCount}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg border-default-200">
        <div className="p-6 overflow-hidden">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
            <h2 className="text-xl text-default-800 font-semibold">All Orders</h2>

            <div className="flex items-center">
              <span className="text-base text-default-950 me-3">Filter :</span>
              <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                <button
                  type="button"
                  className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-950 text-sm py-2.5 px-4 xl:px-5 rounded-full border border-default-200 transition-all"
                >
                  {activeLabel}
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

        <div className="relative overflow-x-auto">
          {loading ? (
            <p className="px-6 py-8 text-sm text-default-500">Loading orders…</p>
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
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800 min-w">
                    Items
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
                      Action
                    </th>
                  ) : null}
                </tr>
              </thead>

              <tbody className="divide-y divide-default-200">
                {orders.map((order) => (
                  <OrderExpandableTableRow
                    key={order.id}
                    order={order}
                    columnCount={TABLE_COLUMN_COUNT}
                    userRole={userRole}
                    onStatusUpdated={updateOrderStatus}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
