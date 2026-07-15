"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";
export function useLogout() {
  const router = useRouter();
  const { setUser } = useContextApi();

  return useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Failed to log out.");
        return;
      }

      toast.success(data.message ?? "Logged out successfully.");
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to log out.",
      );
    }
  }, [router, setUser]);
}
