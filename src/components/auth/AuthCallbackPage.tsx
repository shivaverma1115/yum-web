"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContextApi } from "@/context-api/use-context";
import { createClient } from "@/lib/supabase/client";
import Preloader from "@/components/layout/Preloader";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/home";
  }
  return value;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);
  const { refresh } = useContextApi();

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    async function completeAuth() {
      const authError =
        searchParams.get("error_description") ?? searchParams.get("error");

      if (authError) {
        router.replace(
          `/login?error=auth_callback&message=${encodeURIComponent(authError)}`,
        );
        return;
      }

      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const code = searchParams.get("code");
      const next = safeNextPath(searchParams.get("next"));

      if (token_hash && type) {
        const params = new URLSearchParams({
          token_hash,
          type,
          next,
        });
        router.replace(`/auth/confirm?${params.toString()}`);
        return;
      }

      if (!code) {
        router.replace("/login?error=missing_code");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        const isPkceVerifierError = error.message
          .toLowerCase()
          .includes("pkce code verifier");

        router.replace(
          `/login?error=auth_callback&message=${encodeURIComponent(
            isPkceVerifierError
              ? "Open the confirmation link in the same browser you used to register, or register again to receive a new email."
              : error.message,
          )}`,
        );
        return;
      }

      await refresh();
      router.replace(`${next}?confirmed=1`);
      router.refresh();
    }

    void completeAuth();
  }, [refresh, router, searchParams]);

  return <Preloader />;
}
