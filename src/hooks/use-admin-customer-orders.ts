"use client";

import { useEffect, useState } from "react";
import type { CustomerOrdersFilter } from "@/lib/supabase/orders";
import type { IOrderWithItems } from "@/types/order";

type OrdersResponse = {
  success: boolean;
  message?: string;
  data?: { orders: IOrderWithItems[] };
};

export function useAdminCustomerOrders(
  userId: string,
  filter: CustomerOrdersFilter = "all",
) {
  const [orders, setOrders] = useState<IOrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("Invalid customer id.");
      setOrders([]);
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

        const query = params.toString();
        const url = `/api/admin/customers/${userId}/orders${
          query ? `?${query}` : ""
        }`;

        const response = await fetch(url, { signal: controller.signal });
        const data = (await response.json().catch(
          () => ({}),
        )) as OrdersResponse;

        if (!active) return;

        if (!response.ok || !data.success) {
          setError(data.message ?? "Failed to load orders.");
          setOrders([]);
          return;
        }

        setOrders(data.data?.orders ?? []);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load orders.",
        );
        setOrders([]);
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
  }, [userId, filter]);

  return { orders, loading, error };
}
