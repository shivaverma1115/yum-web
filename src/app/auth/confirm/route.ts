import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/home";
  }
  return value;
}

function loginWithError(origin: string, message?: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", "auth_callback");
  if (message) {
    url.searchParams.set("message", message);
  }
  return NextResponse.redirect(url);
}

/**
 * Cross-browser auth email links (token_hash), e.g. password recovery.
 * Does not require the PKCE code verifier from the originating browser.
 */
export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const origin = requestUrl.origin;

  if (!token_hash || !type) {
    return loginWithError(origin, "Invalid confirmation link.");
  }

  const successUrl = new URL(next, origin);
  successUrl.searchParams.set("confirmed", "1");

  let response = NextResponse.redirect(successUrl);

  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as EmailOtpType,
  });

  if (error) {
    return loginWithError(origin, error.message);
  }

  return response;
}
