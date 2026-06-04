"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { IUser } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";

export type MeApiResponse =
  | {
    success: true;
    data: { user: IUser };
  }
  | {
    success: false;
    message: string;
  };

type ContextApiValue = {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  setUser: (user: IUser | null) => void;
};

const ContextApi = createContext<ContextApiValue | null>(null);

export function ContextApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/me", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({})) as MeApiResponse;

      if (!response.ok || !data.success) {
        setUser(null);
        if (response.status !== 401) {
          setError((data as { message: string })?.message ?? ERROR_MESSAGE_GENERIC);
        }
        return;
      }

      setUser(data.data.user);
    } catch (err) {
      setUser(null);
      setError(
        err instanceof Error ? err.message : "Failed to load current user.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      refresh,
      setUser,
    }),
    [user, loading, error, refresh],
  );

  return (
    <ContextApi.Provider value={value}>
      {children}
    </ContextApi.Provider>
  );
}

export function useContextApi() {
  const context = useContext(ContextApi);

  if (!context) {
    throw new Error("useContextApi must be used within ContextApiProvider");
  }

  return context;
}
