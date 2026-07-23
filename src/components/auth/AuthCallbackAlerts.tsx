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
    const merged = searchParams.get("merged");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (confirmed === "1" || merged === "1" || merged === "0") {
      if (merged === "1") {
        toast.success("Your guest orders were linked to your account.");
      } else if (merged === "0") {
        toast.success("Signed in successfully.");
        toast.warning(
          "Your guest orders could not be linked. Track them with your order number on Track Order.",
        );
      } else {
        toast.success("Signed in successfully.");
      }
      void refresh();
    } else if (error === "auth_callback") {
      toast.error(
        message
          ? decodeURIComponent(message.replace(/\+/g, " "))
          : "Google sign-in failed. Please try again.",
      );
    } else if (error === "missing_code") {
      toast.error("Invalid or expired link. Please try again or contact support.");
    }

    if (confirmed || error || merged === "1" || merged === "0") {
      const url = new URL(window.location.href);
      url.searchParams.delete("confirmed");
      url.searchParams.delete("merged");
      url.searchParams.delete("error");
      url.searchParams.delete("message");
      const qs = url.searchParams.toString();
      router.replace(qs ? `${url.pathname}?${qs}` : url.pathname);
    }
  }, [refresh, router, searchParams]);

  return null;
}
