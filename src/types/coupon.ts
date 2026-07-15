export type CouponDiscountType = "percent" | "fixed";

export type ICoupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

/** Client-side applied coupon (recompute discount when cart subtotal changes). */
export type AppliedCoupon = {
  id: string;
  code: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
};

export type CouponFormPayload = {
  code: string;
  description?: string | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
};
