import type { CouponFormPayload, ICoupon } from "@/types/coupon";

async function parseJson(response: Response) {
  return response.json().catch(() => ({}));
}

export async function createCoupon(payload: CouponFormPayload) {
  const response = await fetch("/api/admin/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return { ok: response.ok && data.success, data, status: response.status };
}

export async function updateCoupon(
  couponId: string,
  payload: Partial<CouponFormPayload>,
) {
  const response = await fetch(`/api/admin/coupons/${couponId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return { ok: response.ok && data.success, data, status: response.status };
}

export async function deleteCoupon(couponId: string) {
  const response = await fetch(`/api/admin/coupons/${couponId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await parseJson(response);
  return { ok: response.ok && data.success, data, status: response.status };
}

export async function validateCouponCode(code: string, subtotal: number) {
  const response = await fetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code, subtotal }),
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && data.success,
    data: data as {
      success?: boolean;
      message?: string;
      data?: { coupon: import("@/types/coupon").AppliedCoupon; discountAmount: number };
    },
    status: response.status,
  };
}

export type { ICoupon };
