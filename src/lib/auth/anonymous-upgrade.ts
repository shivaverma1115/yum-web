import { createHmac, timingSafeEqual } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";

export const ANONYMOUS_MERGE_COOKIE = "yum_anonymous_merge_uid";

const MERGE_COOKIE_TTL_MS = 30 * 60 * 1000;

type MergePayload = {
  userId: string;
  exp: number;
};

export type AnonymousMergeResult = {
  ordersMoved: number;
  productsMoved: number;
  addressesMoved: number;
  pushTokensMoved: number;
  couponsMoved: number;
};

function emptyMergeResult(): AnonymousMergeResult {
  return {
    ordersMoved: 0,
    productsMoved: 0,
    addressesMoved: 0,
    pushTokensMoved: 0,
    couponsMoved: 0,
  };
}

function getSecret(): string {
  const secret =
    process.env.PHONE_OTP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("PHONE_OTP_SECRET is not configured.");
  }
  return secret;
}

function signPayload(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

function verifySignedToken(token: string): MergePayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as MergePayload;
    if (!payload.userId || !payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getAnonymousUserId(
  supabase: SupabaseClient,
): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAnonymousUser(user)) {
    return null;
  }

  return user.id;
}

type MergeRpcRow = {
  orders_moved?: number;
  products_moved?: number;
  addresses_moved?: number;
  push_tokens_moved?: number;
  coupons_moved?: number;
};

/**
 * Moves guest checkout data from an anonymous auth user to a permanent account.
 * Data transfer is a single DB transaction (RPC); auth user delete runs only after.
 */
export async function mergeAnonymousUserIntoAccount(
  admin: SupabaseClient,
  fromUserId: string,
  toUserId: string,
): Promise<AnonymousMergeResult> {
  if (!fromUserId || !toUserId || fromUserId === toUserId) {
    return emptyMergeResult();
  }

  const { data: fromAuth } = await admin.auth.admin.getUserById(fromUserId);
  if (!fromAuth.user || !isAnonymousUser(fromAuth.user)) {
    return emptyMergeResult();
  }

  const { data, error } = await admin.rpc("merge_anonymous_user_data", {
    p_from_user_id: fromUserId,
    p_to_user_id: toUserId,
  });

  if (error) {
    throw new Error(error.message);
  }

  const row = (data ?? {}) as MergeRpcRow;
  const result: AnonymousMergeResult = {
    ordersMoved: Number(row.orders_moved ?? 0),
    productsMoved: Number(row.products_moved ?? 0),
    addressesMoved: Number(row.addresses_moved ?? 0),
    pushTokensMoved: Number(row.push_tokens_moved ?? 0),
    couponsMoved: Number(row.coupons_moved ?? 0),
  };

  // Only delete after the transactional move succeeded.
  const { error: deleteError } = await admin.auth.admin.deleteUser(fromUserId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return result;
}

export function mergeSuccessMessage(result: AnonymousMergeResult): string | null {
  if (result.ordersMoved > 0) {
    return `Your previous guest order${result.ordersMoved === 1 ? "" : "s"} ${result.ordersMoved === 1 ? "was" : "were"} linked to your account.`;
  }
  if (
    result.productsMoved > 0 ||
    result.addressesMoved > 0 ||
    result.pushTokensMoved > 0 ||
    result.couponsMoved > 0
  ) {
    return "Your guest activity was linked to your account.";
  }
  return null;
}

/** HMAC-signed cookie — rejects forged / raw UUID values. */
export function setAnonymousMergeCookie(
  response: NextResponse,
  anonymousUserId: string,
) {
  const token = signPayload({
    userId: anonymousUserId,
    exp: Date.now() + MERGE_COOKIE_TTL_MS,
  });

  response.cookies.set(ANONYMOUS_MERGE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(MERGE_COOKIE_TTL_MS / 1000),
  });
}

export function clearAnonymousMergeCookie(response: NextResponse) {
  response.cookies.set(ANONYMOUS_MERGE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Returns the anonymous user id from a signed merge cookie, or null if invalid.
 * Raw UUID cookies (legacy) are rejected.
 */
export function readAnonymousMergeUserId(
  token: string | undefined,
): string | null {
  if (!token) return null;
  const payload = verifySignedToken(token);
  return payload?.userId ?? null;
}
