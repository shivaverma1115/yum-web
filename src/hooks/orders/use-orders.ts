"use client";

import { useCallback, useEffect, useState } from "react";
import type { CustomerOrdersFilter } from "@/lib/supabase/orders";
import type { IOrderWithItems, OrderStatus } from "@/types/order";
import { UserRole } from "@/types/user";

type OrdersResponse = {
  success: boolean;
  message?: string;
  data?: {
    orders: IOrderWithItems[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

function buildOrdersUrl(
  userRole: UserRole,
  filter: CustomerOrdersFilter,
  page?: number,
  limit?: number,
) {
  const params = new URLSearchParams();
  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (page != null && limit != null) {
    params.set("page", String(page));
    params.set("limit", String(limit));
  }

  const query = params.toString();
  return `/api/${userRole === UserRole.ADMIN ? "admin" : "account"}/orders${query ? `?${query}` : ""}`;
}

export function useOrders(
  filter: CustomerOrdersFilter = "all",
  userRole: UserRole,
  page = 1,
  limit = 10,
) {
  const [orders, setOrders] = useState<IOrderWithItems[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const url = buildOrdersUrl(userRole, filter, page, limit);

        const response = await fetch(url, { signal: controller.signal });
        const data = (await response.json().catch(
          () => ({}),
        )) as OrdersResponse;

        if (!active) return;

        if (!response.ok || !data.success) {
          setError(data.message ?? "Failed to load orders.");
          setOrders([]);
          setTotal(0);
          setTotalPages(1);
          return;
        }

        setOrders(data.data?.orders ?? []);
        setTotal(data.data?.total ?? 0);
        setTotalPages(data.data?.totalPages ?? 1);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load orders.",
        );
        setOrders([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      active = false;
      controller.abort();
    };
  }, [filter, userRole, page, limit]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const updateOrderPaymentStatus = (
    orderId: string,
    paymentStatus: IOrderWithItems["payment_status"],
  ) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, payment_status: paymentStatus }
          : order,
      ),
    );
  };

  const refreshOrders = useCallback(() => {
    setLoading(true);
    setError(null);

    const url = buildOrdersUrl(userRole, filter, page, limit);

    void fetch(url)
      .then((response) => response.json().catch(() => ({})))
      .then((data: OrdersResponse) => {
        if (data.success) {
          setOrders(data.data?.orders ?? []);
          setTotal(data.data?.total ?? 0);
          setTotalPages(data.data?.totalPages ?? 1);
        }
      })
      .finally(() => setLoading(false));
  }, [userRole, filter, page, limit]);

  return {
    orders,
    loading,
    error,
    total,
    totalPages,
    page,
    limit,
    updateOrderStatus,
    updateOrderPaymentStatus,
    refreshOrders,
  };
}
