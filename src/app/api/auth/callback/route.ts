import { NextRequest, NextResponse } from "next/server";
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
 * OAuth callback for providers like Google.
 * Handles PKCE code exchange on the server using cookie-backed storage.
 */
export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const origin = requestUrl.origin;

  if (!code) {
    return loginWithError(origin, "Missing OAuth code.");
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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return loginWithError(origin, error.message);
  }

  return response;
}

