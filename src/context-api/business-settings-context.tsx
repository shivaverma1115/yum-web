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
import {
  BusinessSettings,
  DEFAULT_BUSINESS_SETTINGS,
} from "@/types/business-settings";

type BusinessSettingsResponse = {
  success?: boolean;
  data?: { settings?: BusinessSettings };
};

type BusinessSettingsContextValue = {
  settings: BusinessSettings;
  loading: boolean;
  refresh: () => Promise<void>;
  setSettings: (settings: BusinessSettings) => void;
};

const BusinessSettingsContext =
  createContext<BusinessSettingsContextValue | null>(null);

type BusinessSettingsProviderProps = {
  children: ReactNode;
  initialSettings?: BusinessSettings;
};

export function BusinessSettingsProvider({
  children,
  initialSettings,
}: BusinessSettingsProviderProps) {
  const [settings, setSettings] = useState<BusinessSettings>(
    initialSettings ?? DEFAULT_BUSINESS_SETTINGS,
  );
  const [loading, setLoading] = useState(!initialSettings);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/business-settings", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json().catch(() => ({}))) as BusinessSettingsResponse;

      if (response.ok && data.success && data.data?.settings) {
        setSettings(data.data.settings);
      }
    } catch {
      // Keep current settings on failure.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialSettings) return;
    void refresh();
  }, [initialSettings, refresh]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refresh,
      setSettings,
    }),
    [settings, loading, refresh],
  );

  return (
    <BusinessSettingsContext.Provider value={value}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export function useBusinessSettings() {
  const context = useContext(BusinessSettingsContext);

  if (!context) {
    throw new Error(
      "useBusinessSettings must be used within BusinessSettingsProvider",
    );
  }

  return context;
}
