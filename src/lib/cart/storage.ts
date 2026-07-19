import type { AppliedCoupon } from "@/types/coupon";
import type { ICartItem } from "@/types/cart";

const CART_STORAGE_KEY = "yum-cart";
const COUPON_STORAGE_KEY = "yum-cart-coupon";

/** Scope cart/coupon localStorage by auth user (or guest). */
export function cartAccountId(userId: string | null | undefined): string {
  return userId?.trim() || "guest";
}

function scopedKey(base: string, accountId: string) {
  return `${base}:${accountId}`;
}

function readJson<T>(key: string, legacyKey?: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      window.localStorage.getItem(key) ??
      (legacyKey ? window.localStorage.getItem(legacyKey) : null);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadCartFromStorage(accountId: string): ICartItem[] {
  const parsed = readJson<ICartItem[]>(
    scopedKey(CART_STORAGE_KEY, accountId),
    accountId === "guest" ? CART_STORAGE_KEY : undefined,
  );
  return Array.isArray(parsed) ? parsed : [];
}

export function saveCartToStorage(accountId: string, items: ICartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    scopedKey(CART_STORAGE_KEY, accountId),
    JSON.stringify(items),
  );
}

export function loadCouponFromStorage(accountId: string): AppliedCoupon | null {
  const parsed = readJson<AppliedCoupon>(
    scopedKey(COUPON_STORAGE_KEY, accountId),
    accountId === "guest" ? COUPON_STORAGE_KEY : undefined,
  );
  if (!parsed?.id || !parsed?.code) return null;
  return parsed;
}

export function saveCouponToStorage(
  accountId: string,
  coupon: AppliedCoupon | null,
) {
  if (typeof window === "undefined") return;
  const key = scopedKey(COUPON_STORAGE_KEY, accountId);
  if (!coupon) {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(coupon));
}
