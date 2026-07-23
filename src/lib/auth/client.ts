import type { IUser } from "@/types/user";
import { createClient } from "@/lib/supabase/client";

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

type ApiResult<T> = ApiSuccess<T> | ApiFailure;

async function parseApiResponse<T>(response: Response): Promise<ApiResult<T>> {
  const data = (await response.json().catch(() => ({}))) as ApiResult<T>;

  if (!response.ok || !data.success) {
    return {
      success: false,
      message:
        (!data.success && data.message) ||
        "Something went wrong. Please try again.",
      errors: !data.success ? data.errors : undefined,
    };
  }

  return data;
}

export async function loginWithEmailClient(
  email: string,
  password: string,
): Promise<ApiResult<{ user: IUser; mergeMessage?: string | null }>> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return parseApiResponse<{ user: IUser; mergeMessage?: string | null }>(
    response,
  );
}

/** Checks email + password before sending login OTP (no lasting session). */
export async function verifyEmailCredentialsClient(
  email: string,
  password: string,
): Promise<ApiResult<Record<string, never>>> {
  const response = await fetch("/api/auth/verify-credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return parseApiResponse<Record<string, never>>(response);
}

export type RegisterEmailPayload = {
  email: string;
  password: string;
  phone?: string;
};

export async function registerWithEmailClient(
  payload: RegisterEmailPayload,
): Promise<ApiResult<{ user: IUser }>> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseApiResponse<{ user: IUser }>(response);
}

export async function sendAuthPhoneOtpClient(
  phone: string,
): Promise<ApiResult<{ phone: string }>> {
  const response = await fetch("/api/auth/phone/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });

  return parseApiResponse<{ phone: string }>(response);
}

export async function verifyAuthPhoneOtpClient(
  phone: string,
  otp: string,
): Promise<ApiResult<{ user: IUser; isNewUser: boolean; mergeMessage?: string | null }>> {
  const response = await fetch("/api/auth/phone/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone, otp }),
  });

  return parseApiResponse<{
    user: IUser;
    isNewUser: boolean;
    mergeMessage?: string | null;
  }>(response);
}

/** Prefer the live browser origin; fall back to NEXT_PUBLIC_SITE_URL if needed. */
function getOAuthRedirectOrigin(): string {
  const browserOrigin = window.location.origin;
  try {
    const host = new URL(browserOrigin).hostname;
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]") {
      return browserOrigin;
    }
  } catch {
    // fall through
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const parsed = new URL(configured);
      if (
        parsed.hostname !== "localhost" &&
        parsed.hostname !== "127.0.0.1" &&
        parsed.hostname !== "[::1]"
      ) {
        return parsed.origin;
      }
    } catch {
      // fall through
    }
  }

  return browserOrigin;
}

/**
 * Always prepare-merge before OAuth (API no-ops if not anonymous).
 * Avoids linkIdentity, which fails when the Google email already exists.
 */
export async function signInWithGoogleClient(
  nextPath = "/home",
): Promise<{ success: true } | { success: false; message: string }> {
  const supabase = createClient();
  const redirectUrl = new URL("/api/auth/callback", getOAuthRedirectOrigin());
  redirectUrl.searchParams.set("next", nextPath);

  // Always call prepare-merge — do not gate on client isAnonymous (race with /me).
  const prepareResponse = await fetch("/api/auth/anonymous/prepare-merge", {
    method: "POST",
    credentials: "include",
  });
  if (!prepareResponse.ok && prepareResponse.status !== 401) {
    const prepareBody = (await prepareResponse.json().catch(() => ({}))) as {
      message?: string;
    };
    return {
      success: false,
      message:
        prepareBody.message ??
        "Could not prepare guest order linking. Please try again.",
    };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl.toString(),
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
