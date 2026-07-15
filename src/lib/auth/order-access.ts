import type { User } from "@supabase/supabase-js";
import type { IUser } from "@/types/user";
import { UserRole } from "@/types/user";

export type AuthorizedSession = {
  user: User;
  profile: IUser | null;
};

export type OrderAccessDenied = {
  allowed: false;
  status: 403 | 404;
  message: string;
};

export type OrderAccessResult = { allowed: true } | OrderAccessDenied;

export function isOrderAdmin(profile: IUser | null | undefined): boolean {
  return profile?.role === UserRole.ADMIN;
}

export function isOrderOwner(authUserId: string, orderUserId: string): boolean {
  return orderUserId === authUserId;
}

export function canAccessOrder(
  session: AuthorizedSession,
  orderUserId: string,
): boolean {
  return (
    isOrderOwner(session.user.id, orderUserId) || isOrderAdmin(session.profile)
  );
}

export function assertOrderAccess(
  session: AuthorizedSession,
  orderUserId: string | null | undefined,
): OrderAccessResult {
  if (!orderUserId) {
    return {
      allowed: false,
      status: 404,
      message: "Order not found.",
    };
  }

  if (!canAccessOrder(session, orderUserId)) {
    return {
      allowed: false,
      status: 403,
      message: "You do not have access to this order.",
    };
  }

  return { allowed: true };
}

/** Payment retry and checkout completion must be initiated by the order owner. */
export function assertOrderOwner(
  session: AuthorizedSession,
  orderUserId: string | null | undefined,
): OrderAccessResult {
  if (!orderUserId) {
    return {
      allowed: false,
      status: 404,
      message: "Order not found.",
    };
  }

  if (!isOrderOwner(session.user.id, orderUserId)) {
    return {
      allowed: false,
      status: 403,
      message: "You do not have access to this order.",
    };
  }

  return { allowed: true };
}
