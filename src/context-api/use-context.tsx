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
import type { IUser, UserVerificationStatus } from "@/types/user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";

export type MeApiResponse =
  | {
    success: true;
    data: {
      user: IUser;
      verification: UserVerificationStatus;
      is_anonymous?: boolean;
    };
  }
  | {
    success: false;
    message: string;
  };

type ContextApiValue = {
  user: IUser | null;
  verification: UserVerificationStatus | null;
  isAnonymous: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  setUser: (user: IUser | null) => void;
};

const ContextApi = createContext<ContextApiValue | null>(null);

export function ContextApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [verification, setVerification] = useState<UserVerificationStatus | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/account/me", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({})) as MeApiResponse;

      if (!response.ok || !data.success) {
        setUser(null);
        setVerification(null);
        setIsAnonymous(false);
        if (response.status !== 401) {
          setError((data as { message: string })?.message ?? ERROR_MESSAGE_GENERIC);
        }
        return;
      }

      setUser(data.data.user ?? null);
      setVerification(data.data.verification ?? null);
      setIsAnonymous(Boolean(data.data.is_anonymous));
    } catch (err) {
      setUser(null);
      setVerification(null);
      setIsAnonymous(false);
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
      verification,
      isAnonymous,
      loading,
      error,
      isAuthenticated: Boolean(user),
      refresh,
      setUser,
    }),
    [user, verification, isAnonymous, loading, error, refresh],
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
