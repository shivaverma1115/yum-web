import { NextRequest, NextResponse } from "next/server";
import {
  getAuthMethodDisabledMessage,
  isGoogleAuthEnabled,
} from "@/lib/business-settings/auth-methods";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import {
  ANONYMOUS_MERGE_COOKIE,
  clearAnonymousMergeCookie,
  mergeAnonymousUserIntoAccount,
  mergeSuccessMessage,
} from "@/lib/auth/anonymous-upgrade";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";
import { logError } from "@/lib/utils/logError";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/home";
  }
  return value;
}

function mapOAuthCallbackError(
  errorCode: string | null,
  errorDescription: string | null,
  hasMergeCookie: boolean,
): string {
  if (errorCode === "email_exists") {
    if (hasMergeCookie) {
      return "This Google account already exists. Click Sign in with Google again — your guest orders will be linked.";
    }
    return "This Google account is already registered. Sign in instead of creating a new account.";
  }

  if (errorCode === "manual_linking_disabled") {
    return "Google sign-in is misconfigured. Please try again or use email or phone sign-in.";
  }

  if (errorDescription?.trim()) {
    return errorDescription.replace(/\+/g, " ");
  }

  return "Google sign-in was cancelled or failed. Please try again.";
}

function loginWithError(
  origin: string,
  message: string,
  options?: { next?: string; keepMergeCookie?: boolean },
) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", "auth_callback");
  url.searchParams.set("message", message);
  if (options?.next) {
    url.searchParams.set("redirectTo", options.next);
  }
  const response = NextResponse.redirect(url);
  if (!options?.keepMergeCookie) {
    clearAnonymousMergeCookie(response);
  }
  return response;
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
  const mergeFromId = request.cookies.get(ANONYMOUS_MERGE_COOKIE)?.value ?? null;
  const oauthError = requestUrl.searchParams.get("error");
  const errorCode = requestUrl.searchParams.get("error_code");
  const errorDescription = requestUrl.searchParams.get("error_description");

  const settings = await getCachedBusinessSettings();
  if (!isGoogleAuthEnabled(settings)) {
    return loginWithError(origin, getAuthMethodDisabledMessage("google"));
  }

  if (!code) {
    if (oauthError || errorCode || errorDescription) {
      const message = mapOAuthCallbackError(
        errorCode,
        errorDescription,
        Boolean(mergeFromId),
      );
      return loginWithError(origin, message, {
        next,
        keepMergeCookie: errorCode === "email_exists" && Boolean(mergeFromId),
      });
    }

    return loginWithError(origin, "Google sign-in did not complete. Please try again.", {
      next,
    });
  }

  const sessionCookies: {
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }[] = [];

  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll(cookiesToSet) {
      sessionCookies.push(...cookiesToSet);
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return loginWithError(origin, error.message, { next });
  }

  let ordersMerged = false;
  const targetUserId = data.user?.id;

  if (mergeFromId && targetUserId && mergeFromId !== targetUserId) {
    try {
      const admin = createAdminClient();
      const merge = await mergeAnonymousUserIntoAccount(
        admin,
        mergeFromId,
        targetUserId,
      );
      ordersMerged = Boolean(mergeSuccessMessage(merge));
    } catch (mergeError) {
      logError(mergeError, {
        context: "OAuth Anonymous Merge",
        meta: { mergeFromId, targetUserId },
      });
    }
  }

  const successUrl = new URL(next, origin);
  successUrl.searchParams.set("confirmed", "1");
  if (ordersMerged) {
    successUrl.searchParams.set("merged", "1");
  }

  const response = NextResponse.redirect(successUrl);
  sessionCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  clearAnonymousMergeCookie(response);

  return response;
}
