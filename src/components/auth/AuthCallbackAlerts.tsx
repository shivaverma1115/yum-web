"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";

export default function AuthCallbackAlerts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useContextApi();

  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (confirmed === "1") {
      toast.success("Email confirmed. You are signed in.");
      void refresh();
    } else if (error === "auth_callback") {
      toast.error(
        message ? decodeURIComponent(message) : "Confirmation link expired or invalid.",
      );
    } else if (error === "missing_code") {
      toast.error("Invalid confirmation link. Try signing up again or contact support.");
    }

    if (confirmed || error) {
      const url = new URL(window.location.href);
      url.searchParams.delete("confirmed");
      url.searchParams.delete("error");
      url.searchParams.delete("message");
      const qs = url.searchParams.toString();
      router.replace(qs ? `${url.pathname}?${qs}` : url.pathname);
    }
  }, [refresh, router, searchParams]);

  return null;
}
