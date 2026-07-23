"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContextApi } from "@/context-api/use-context";
import {
  handleRealtimeOrderInsert,
  handleRealtimeOrderUpdate,
} from "@/hooks/orders/order-realtime-helpers";
import { useOrdersRealtime } from "@/hooks/orders/use-orders-realtime";
import {
  buildOrderListSearchParams,
  DEFAULT_ORDER_LIST_FILTERS,
  type OrderListFilters,
  type OrderListStats,
} from "@/lib/supabase/orders";
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
    stats?: OrderListStats;
  };
};

function buildOrdersUrl(
  userRole: UserRole,
  filters: OrderListFilters,
  page?: number,
  limit?: number,
) {
  const params = buildOrderListSearchParams(filters, page, limit);
  const query = params.toString();
  return `/api/${userRole === UserRole.ADMIN ? "admin" : "account"}/orders${query ? `?${query}` : ""}`;
}

const REALTIME_ORDER_HIGHLIGHT_MS = 10_000;

export function useOrders(
  filters: OrderListFilters = DEFAULT_ORDER_LIST_FILTERS,
  userRole: UserRole,
  page = 1,
  limit = 10,
) {
  const [orders, setOrders] = useState<IOrderWithItems[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<OrderListStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentRealtimeOrderIds, setRecentRealtimeOrderIds] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const highlightTimersRef = useRef<Map<string, number>>(new Map());
  const { user } = useContextApi();

  const markRealtimeOrder = useCallback((orderId: string) => {
    setRecentRealtimeOrderIds((current) => new Set(current).add(orderId));

    const existingTimer = highlightTimersRef.current.get(orderId);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    const timer = window.setTimeout(() => {
      setRecentRealtimeOrderIds((current) => {
        const next = new Set(current);
        next.delete(orderId);
        return next;
      });
      highlightTimersRef.current.delete(orderId);
    }, REALTIME_ORDER_HIGHLIGHT_MS);

    highlightTimersRef.current.set(orderId, timer);
  }, []);

  useEffect(
    () => () => {
      for (const timer of highlightTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      highlightTimersRef.current.clear();
    },
    [],
  );

  const realtimeContext = useMemo(
    () => ({ filters, page, limit }),
    [filters, page, limit],
  );

  const applyRealtimeInsert = useCallback(
    (inserted: Parameters<typeof handleRealtimeOrderInsert>[0]) => {
      void handleRealtimeOrderInsert(
        inserted,
        realtimeContext,
        setOrders,
        setTotal,
        setTotalPages,
        markRealtimeOrder,
      );
    },
    [realtimeContext, markRealtimeOrder],
  );

  const applyRealtimeOrder = useCallback(
    (updated: Parameters<typeof handleRealtimeOrderUpdate>[0]) => {
      handleRealtimeOrderUpdate(
        updated,
        realtimeContext,
        setOrders,
        setTotal,
        setTotalPages,
        markRealtimeOrder,
      );
    },
    [realtimeContext, markRealtimeOrder],
  );

  const realtimeScope = useMemo(() => {
    if (userRole === UserRole.ADMIN) {
      return { mode: "all" as const };
    }

    if (user?.id) {
      return { mode: "user" as const, userId: user.id };
    }

    return null;
  }, [userRole, user?.id]);

  useOrdersRealtime({
    scope: realtimeScope,
    enabled: Boolean(realtimeScope),
    onOrderInserted: applyRealtimeInsert,
    onOrderUpdated: applyRealtimeOrder,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const url = buildOrdersUrl(userRole, filters, page, limit);

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
          setStats(null);
          return;
        }

        setOrders(data.data?.orders ?? []);
        setTotal(data.data?.total ?? 0);
        setTotalPages(data.data?.totalPages ?? 1);
        setStats(data.data?.stats ?? null);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load orders.",
        );
        setOrders([]);
        setTotal(0);
        setTotalPages(1);
        setStats(null);
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
  }, [filters, userRole, page, limit, user?.id]);

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

    const url = buildOrdersUrl(userRole, filters, page, limit);

    void fetch(url)
      .then((response) => response.json().catch(() => ({})))
      .then((data: OrdersResponse) => {
        if (data.success) {
          setOrders(data.data?.orders ?? []);
          setTotal(data.data?.total ?? 0);
          setTotalPages(data.data?.totalPages ?? 1);
          setStats(data.data?.stats ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, [userRole, filters, page, limit]);

  return {
    orders,
    loading,
    error,
    total,
    totalPages,
    page,
    limit,
    stats,
    updateOrderStatus,
    updateOrderPaymentStatus,
    refreshOrders,
    recentRealtimeOrderIds,
  };
}
