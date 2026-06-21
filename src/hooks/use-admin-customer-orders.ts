"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  handleRealtimeOrderInsert,
  handleRealtimeOrderUpdate,
} from "@/hooks/orders/order-realtime-helpers";
import { useOrdersRealtime } from "@/hooks/orders/use-orders-realtime";
import type { CustomerOrdersFilter } from "@/lib/supabase/orders";
import type { IOrderWithItems } from "@/types/order";

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

export function useAdminCustomerOrders(
  userId: string,
  filter: CustomerOrdersFilter = "all",
  page = 1,
  limit = 10,
) {
  const [orders, setOrders] = useState<IOrderWithItems[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const realtimeContext = useMemo(
    () => ({ filter, page, limit }),
    [filter, page, limit],
  );

  const applyRealtimeInsert = useCallback(
    (inserted: Parameters<typeof handleRealtimeOrderInsert>[0]) => {
      void handleRealtimeOrderInsert(
        inserted,
        realtimeContext,
        setOrders,
        setTotal,
        setTotalPages,
      );
    },
    [realtimeContext],
  );

  const applyRealtimeOrder = useCallback(
    (updated: Parameters<typeof handleRealtimeOrderUpdate>[0]) => {
      handleRealtimeOrderUpdate(
        updated,
        realtimeContext,
        setOrders,
        setTotal,
        setTotalPages,
      );
    },
    [realtimeContext],
  );

  useOrdersRealtime({
    scope: userId ? { mode: "user", userId } : null,
    enabled: Boolean(userId),
    onOrderInserted: applyRealtimeInsert,
    onOrderUpdated: applyRealtimeOrder,
  });

  useEffect(() => {
    if (!userId) {
      setError("Invalid customer id.");
      setOrders([]);
      setTotal(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filter !== "all") {
          params.set("filter", filter);
        }
        params.set("page", String(page));
        params.set("limit", String(limit));

        const url = `/api/admin/customers/${userId}/orders?${params.toString()}`;

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
  }, [userId, filter, page, limit]);

  return { orders, loading, error, total, totalPages, page, limit };
}
