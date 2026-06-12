"use client";

import { useEffect, useState } from "react";
import {
  BusinessSettings,
  DEFAULT_BUSINESS_SETTINGS,
} from "@/types/business-settings";

type BusinessSettingsResponse = {
  success?: boolean;
  data?: { settings?: BusinessSettings };
};

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>(
    DEFAULT_BUSINESS_SETTINGS,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadSettings = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/business-settings", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await response.json().catch(() => ({}))) as BusinessSettingsResponse;

        if (!active) return;

        if (response.ok && data.success && data.data?.settings) {
          setSettings(data.data.settings);
        }
      } catch {
        if (!active || controller.signal.aborted) return;
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { settings, loading };
}
