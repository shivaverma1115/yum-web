"use client";

import { useEffect, useState } from "react";

type TableNumbersResponse = {
  success?: boolean;
  data?: { tableNumbers?: string[] };
};

export function useActiveTableNumbers() {
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    void (async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/table-qr", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = (await response.json().catch(() => ({}))) as TableNumbersResponse;

        if (!active) return;

        if (response.ok && data.success) {
          setTableNumbers(data.data?.tableNumbers ?? []);
        } else {
          setTableNumbers([]);
        }
      } catch {
        if (!active || controller.signal.aborted) return;
        setTableNumbers([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { tableNumbers, loading };
}
