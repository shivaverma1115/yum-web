"use client";

import { useEffect, useState } from "react";
import type { IUser } from "@/types/user";
import { getUserDisplayName } from "@/lib/user/display-name";

type CustomerResponse = {
  success: boolean;
  message?: string;
  data?: { user: IUser };
};

export function getCustomerDisplayName(user: IUser) {
  return getUserDisplayName(user);
}

export function getCustomerLocation(user: IUser) {
  const parts = [user.state, user.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export function useAdminCustomer(userId: string) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("Invalid customer id.");
      setUser(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function loadCustomer() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/customers/${userId}`, {
          signal: controller.signal,
        });
        const data = (await response.json().catch(
          () => ({}),
        )) as CustomerResponse;

        if (!active) return;

        if (!response.ok || !data.success || !data.data?.user) {
          setError(data.message ?? "Failed to load customer.");
          setUser(null);
          return;
        }

        setUser(data.data.user);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load customer.",
        );
        setUser(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCustomer();

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId]);

  return { user, loading, error };
}
