"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";
import { createClient } from "@/lib/supabase/client";

/**
 * Fallback when the auth code lands on a page without the server callback
 * attaching cookies (or when only the client can complete PKCE).
 */
export default function AuthCodeExchange() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handled = useRef(false);
  const { refresh } = useContextApi();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || handled.current) return;

    handled.current = true;

    async function exchange() {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code as string);

      const next = new URL(window.location.href);
      next.searchParams.delete("code");
      next.searchParams.delete("type");

      if (error) {
        next.searchParams.set("error", "auth_callback");
        next.searchParams.set("message", error.message);
        router.replace(`${next.pathname}?${next.searchParams.toString()}`);
        toast.error(error.message);
        return;
      }

      next.searchParams.set("confirmed", "1");
      router.replace(`${next.pathname}?${next.searchParams.toString()}`);
      router.refresh();
      toast.success("Email confirmed. You are signed in.");
      void refresh();
    }

    void exchange();
  }, [pathname, refresh, router, searchParams]);

  return null;
}
