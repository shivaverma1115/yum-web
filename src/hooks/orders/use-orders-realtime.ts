"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { IOrder } from "@/types/order";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type OrdersRealtimeScope =
  | { mode: "all" }
  | { mode: "user"; userId: string };

type UseOrdersRealtimeOptions = {
  scope: OrdersRealtimeScope | null;
  enabled?: boolean;
  onOrderUpdated: (order: IOrder) => void;
};

function getScopeKey(scope: OrdersRealtimeScope | null): string | null {
  if (!scope) return null;
  if (scope.mode === "all") return "all";
  return `user:${scope.userId}`;
}

/** RLS on `orders` scopes events; no column filter needed. */
const ORDERS_UPDATE_CONFIG = {
  event: "UPDATE" as const,
  schema: "public" as const,
  table: "orders" as const,
};

export function useOrdersRealtime({
  scope,
  enabled = true,
  onOrderUpdated,
}: UseOrdersRealtimeOptions) {
  const onOrderUpdatedRef = useRef(onOrderUpdated);
  onOrderUpdatedRef.current = onOrderUpdated;

  const scopeKey = getScopeKey(scope);

  useEffect(() => {
    if (!enabled || !scope || !scopeKey) return;

    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let cancelled = false;
    let subscribeGeneration = 0;

    const channelName =
      scope.mode === "all" ? "orders:admin" : `orders:user:${scope.userId}`;

    const teardownChannel = () => {
      if (!channel) return;
      const existing = channel;
      channel = null;
      void supabase.removeChannel(existing);
    };

    const subscribe = async () => {
      const generation = ++subscribeGeneration;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled || generation !== subscribeGeneration) return;

      if (!session) {
        teardownChannel();
        return;
      }

      teardownChannel();

      channel = supabase
        .channel(channelName)
        .on("postgres_changes", ORDERS_UPDATE_CONFIG, (payload) => {
          const updated = payload.new as IOrder;

          if (updated?.id) {
            onOrderUpdatedRef.current(updated);
          }
        })
        // .subscribe((status, err) => {
        //   console.log("[orders realtime] subscription status:", status, {
        //     scope: scopeKey,
        //     channel: channelName,
        //     error: err?.message ?? null,
        //   });
        // });
    };

    void subscribe();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      void subscribe();
    });

    return () => {
      cancelled = true;
      subscribeGeneration += 1;
      authSubscription.unsubscribe();
      teardownChannel();
    };
  }, [enabled, scope, scopeKey]);
}
