import type { AppliedCoupon } from "@/types/coupon";
import type { ICartItem } from "@/types/cart";

const CART_STORAGE_KEY = "yum-cart";
const COUPON_STORAGE_KEY = "yum-cart-coupon";

export function loadCartFromStorage(): ICartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ICartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: ICartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function loadCouponFromStorage(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COUPON_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppliedCoupon;
    if (!parsed?.id || !parsed?.code) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCouponToStorage(coupon: AppliedCoupon | null) {
  if (typeof window === "undefined") return;
  if (!coupon) {
    window.localStorage.removeItem(COUPON_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
}
