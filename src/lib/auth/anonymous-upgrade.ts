import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";

export const ANONYMOUS_MERGE_COOKIE = "yum_anonymous_merge_uid";

const MERGE_COOKIE_MAX_AGE = 30 * 60;

export type AnonymousMergeResult = {
  ordersMoved: number;
  productsMoved: number;
};

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

/**
 * Moves guest checkout data from an anonymous auth user to a permanent account.
 */
export async function mergeAnonymousUserIntoAccount(
  admin: SupabaseClient,
  fromUserId: string,
  toUserId: string,
): Promise<AnonymousMergeResult> {
  if (!fromUserId || !toUserId || fromUserId === toUserId) {
    return { ordersMoved: 0, productsMoved: 0 };
  }

  const { data: fromAuth } = await admin.auth.admin.getUserById(fromUserId);
  if (!fromAuth.user || !isAnonymousUser(fromAuth.user)) {
    return { ordersMoved: 0, productsMoved: 0 };
  }

  const { data: movedOrders, error: ordersError } = await admin
    .from("orders")
    .update({ user_id: toUserId })
    .eq("user_id", fromUserId)
    .select("id");

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const { data: movedProducts, error: productsError } = await admin
    .from("products")
    .update({ user_id: toUserId })
    .eq("user_id", fromUserId)
    .select("id");

  if (productsError) {
    throw new Error(productsError.message);
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(fromUserId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return {
    ordersMoved: movedOrders?.length ?? 0,
    productsMoved: movedProducts?.length ?? 0,
  };
}

export function mergeSuccessMessage(result: AnonymousMergeResult): string | null {
  if (result.ordersMoved > 0) {
    return `Your previous guest order${result.ordersMoved === 1 ? "" : "s"} ${result.ordersMoved === 1 ? "was" : "were"} linked to your account.`;
  }
  if (result.productsMoved > 0) {
    return "Your guest activity was linked to your account.";
  }
  return null;
}

export function setAnonymousMergeCookie(
  response: NextResponse,
  anonymousUserId: string,
) {
  response.cookies.set(ANONYMOUS_MERGE_COOKIE, anonymousUserId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MERGE_COOKIE_MAX_AGE,
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
