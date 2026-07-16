import type { Dispatch, SetStateAction } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  orderMatchesListFilters,
  type OrderListFilters,
} from "@/lib/supabase/orders";
import type { IOrder, IOrderItem, IOrderWithItems } from "@/types/order";

export type RealtimeOrdersListContext = {
  filters: OrderListFilters;
  page: number;
  limit: number;
};

function setTotalWithPages(
  setTotal: Dispatch<SetStateAction<number>>,
  setTotalPages: Dispatch<SetStateAction<number>>,
  limit: number,
  updater: (current: number) => number,
) {
  setTotal((current) => {
    const nextTotal = updater(current);
    setTotalPages(Math.max(1, Math.ceil(nextTotal / limit)));
    return nextTotal;
  });
}

export async function fetchOrderWithItems(
  orderId: string,
): Promise<IOrderWithItems | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!data) {
    return null;
  }

  const { order_items, ...order } = data;
  return {
    ...(order as IOrder),
    items: (order_items ?? []) as IOrderItem[],
  };
}

function hydrateOrderItems(
  orderId: string,
  setOrders: Dispatch<SetStateAction<IOrderWithItems[]>>,
) {
  void fetchOrderWithItems(orderId).then((full) => {
    if (!full) {
      return;
    }

    setOrders((current) =>
      current.map((order) => (order.id === orderId ? full : order)),
    );
  });
}

export async function handleRealtimeOrderInsert(
  inserted: IOrder,
  ctx: RealtimeOrdersListContext,
  setOrders: Dispatch<SetStateAction<IOrderWithItems[]>>,
  setTotal: Dispatch<SetStateAction<number>>,
  setTotalPages: Dispatch<SetStateAction<number>>,
  onVisibleInsert?: (orderId: string) => void,
) {
  if (
    !inserted.id ||
    !orderMatchesListFilters(inserted, ctx.filters)
  ) {
    return;
  }

  let insertedNew = false;

  setOrders((current) => {
    if (current.some((order) => order.id === inserted.id)) {
      return current;
    }

    insertedNew = true;

    if (ctx.page !== 1) {
      return current;
    }

    const next: IOrderWithItems[] = [
      { ...inserted, items: [] },
      ...current,
    ];
    if (next.length > ctx.limit) {
      next.pop();
    }
    return next;
  });

  if (!insertedNew) {
    return;
  }

  setTotalWithPages(setTotal, setTotalPages, ctx.limit, (total) => total + 1);

  if (ctx.page === 1) {
    onVisibleInsert?.(inserted.id);
    hydrateOrderItems(inserted.id, setOrders);
  }
}

export function handleRealtimeOrderUpdate(
  updated: IOrder,
  ctx: RealtimeOrdersListContext,
  setOrders: Dispatch<SetStateAction<IOrderWithItems[]>>,
  setTotal: Dispatch<SetStateAction<number>>,
  setTotalPages: Dispatch<SetStateAction<number>>,
  onVisibleInsert?: (orderId: string) => void,
) {
  if (!updated.id) {
    return;
  }

  const orderId = updated.id;
  const matches = orderMatchesListFilters(updated, ctx.filters);

  setOrders((current) => {
    const exists = current.some((order) => order.id === orderId);

    if (exists && !matches) {
      setTotalWithPages(setTotal, setTotalPages, ctx.limit, (total) =>
        Math.max(0, total - 1),
      );
      return current.filter((order) => order.id !== orderId);
    }

    if (!exists && matches && ctx.page === 1) {
      setTotalWithPages(setTotal, setTotalPages, ctx.limit, (total) => total + 1);

      const next: IOrderWithItems[] = [
        { ...updated, items: [] },
        ...current,
      ];
      if (next.length > ctx.limit) {
        next.pop();
      }

      hydrateOrderItems(orderId, setOrders);
      onVisibleInsert?.(orderId);
      return next;
    }

    if (!exists) {
      return current;
    }

    return current.map((order) =>
      order.id === orderId ? { ...order, ...updated } : order,
    );
  });
}
