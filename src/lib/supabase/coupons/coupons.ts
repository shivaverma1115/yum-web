import type { SupabaseClient } from "@supabase/supabase-js";
import {
  computeCouponDiscountAmount,
  couponToApplied,
  isCouponCurrentlyValid,
  normalizeCouponCode,
  roundMoney,
} from "@/lib/coupons/discount";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import type { AppliedCoupon, CouponFormPayload, ICoupon } from "@/types/coupon";

function mapCoupon(row: Record<string, unknown>): ICoupon {
  return {
    id: String(row.id),
    code: String(row.code),
    description: (row.description as string | null) ?? null,
    discount_type: row.discount_type as ICoupon["discount_type"],
    discount_value: Number(row.discount_value),
    min_order_amount: Number(row.min_order_amount) || 0,
    max_discount_amount:
      row.max_discount_amount == null ? null : Number(row.max_discount_amount),
    starts_at: (row.starts_at as string | null) ?? null,
    ends_at: (row.ends_at as string | null) ?? null,
    is_active: Boolean(row.is_active),
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export async function listCouponsWithSupabase(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false as const,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return {
    success: true as const,
    coupons: (data ?? []).map((row) => mapCoupon(row as Record<string, unknown>)),
  };
}

export async function createCouponWithSupabase(
  supabase: SupabaseClient,
  payload: CouponFormPayload,
) {
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code: normalizeCouponCode(payload.code),
      description: payload.description ?? null,
      discount_type: payload.discount_type,
      discount_value: payload.discount_value,
      min_order_amount: payload.min_order_amount ?? 0,
      max_discount_amount: payload.max_discount_amount ?? null,
      starts_at: payload.starts_at ?? null,
      ends_at: payload.ends_at ?? null,
      is_active: payload.is_active ?? true,
    })
    .select("*")
    .single();

  if (error || !data) {
    const message = error?.message ?? ERROR_MESSAGE_GENERIC;
    const isDuplicate = message.toLowerCase().includes("duplicate");
    return {
      success: false as const,
      message: isDuplicate
        ? "A coupon with this code already exists."
        : message,
      status: 400,
      errors: isDuplicate ? { code: "Code already in use." } : undefined,
    };
  }

  return {
    success: true as const,
    coupon: mapCoupon(data as Record<string, unknown>),
  };
}

export async function updateCouponWithSupabase(
  supabase: SupabaseClient,
  couponId: string,
  payload: Partial<CouponFormPayload>,
) {
  const updates: Record<string, unknown> = {};
  if (payload.code !== undefined) updates.code = normalizeCouponCode(payload.code);
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.discount_type !== undefined) {
    updates.discount_type = payload.discount_type;
  }
  if (payload.discount_value !== undefined) {
    updates.discount_value = payload.discount_value;
  }
  if (payload.min_order_amount !== undefined) {
    updates.min_order_amount = payload.min_order_amount;
  }
  if (payload.max_discount_amount !== undefined) {
    updates.max_discount_amount = payload.max_discount_amount;
  }
  if (payload.starts_at !== undefined) updates.starts_at = payload.starts_at;
  if (payload.ends_at !== undefined) updates.ends_at = payload.ends_at;
  if (payload.is_active !== undefined) updates.is_active = payload.is_active;

  const { data, error } = await supabase
    .from("coupons")
    .update(updates)
    .eq("id", couponId)
    .select("*")
    .single();

  if (error || !data) {
    const message = error?.message ?? ERROR_MESSAGE_GENERIC;
    const isDuplicate = message.toLowerCase().includes("duplicate");
    return {
      success: false as const,
      message: isDuplicate
        ? "A coupon with this code already exists."
        : message,
      status: 400,
      errors: isDuplicate ? { code: "Code already in use." } : undefined,
    };
  }

  return {
    success: true as const,
    coupon: mapCoupon(data as Record<string, unknown>),
  };
}

export async function deleteCouponWithSupabase(
  supabase: SupabaseClient,
  couponId: string,
) {
  const { error } = await supabase.from("coupons").delete().eq("id", couponId);

  if (error) {
    return {
      success: false as const,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true as const };
}

export type ValidateCouponResult =
  | {
      success: true;
      coupon: AppliedCoupon;
      discountAmount: number;
      message: string;
    }
  | {
      success: false;
      message: string;
      status: number;
    };

export async function validateCouponForUser(
  supabase: SupabaseClient,
  params: {
    code: string;
    subtotal: number;
    userId?: string | null;
  },
): Promise<ValidateCouponResult> {
  const code = normalizeCouponCode(params.code);
  if (!code) {
    return { success: false, message: "Enter a coupon code.", status: 400 };
  }

  const subtotal = roundMoney(Math.max(0, Number(params.subtotal) || 0));
  if (subtotal <= 0) {
    return {
      success: false,
      message: "Add items to your cart before applying a coupon.",
      status: 400,
    };
  }

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  if (!data) {
    return { success: false, message: "Invalid coupon code.", status: 404 };
  }

  const coupon = mapCoupon(data as Record<string, unknown>);

  if (!isCouponCurrentlyValid(coupon)) {
    return {
      success: false,
      message: "This coupon is not active right now.",
      status: 400,
    };
  }

  if (subtotal < coupon.min_order_amount) {
    return {
      success: false,
      message: `Minimum order of ₹${coupon.min_order_amount} required for this coupon.`,
      status: 400,
    };
  }

  if (params.userId) {
    const { data: redemption, error: redemptionError } = await supabase
      .from("coupon_redemptions")
      .select("id")
      .eq("coupon_id", coupon.id)
      .eq("user_id", params.userId)
      .maybeSingle();

    if (redemptionError) {
      return {
        success: false,
        message: redemptionError.message ?? ERROR_MESSAGE_GENERIC,
        status: 400,
      };
    }

    if (redemption) {
      return {
        success: false,
        message: "You have already used this coupon.",
        status: 400,
      };
    }
  }

  const applied = couponToApplied(coupon);
  const discountAmount = computeCouponDiscountAmount(applied, subtotal);

  if (discountAmount <= 0) {
    return {
      success: false,
      message: "This coupon does not apply to your cart.",
      status: 400,
    };
  }

  return {
    success: true,
    coupon: applied,
    discountAmount,
    message: "Coupon applied successfully.",
  };
}

/** Commit coupon to user (one use). Idempotent per order. */
export async function redeemCouponForOrder(
  supabase: SupabaseClient,
  params: {
    couponId: string;
    userId: string;
    orderId: string;
    discountAmount: number;
  },
) {
  const { data: existing } = await supabase
    .from("coupon_redemptions")
    .select("id, order_id")
    .eq("coupon_id", params.couponId)
    .eq("user_id", params.userId)
    .maybeSingle();

  if (existing) {
    if (existing.order_id === params.orderId) {
      return { success: true as const };
    }
    return {
      success: false as const,
      message: "This coupon was already used.",
      status: 400,
    };
  }

  const { error } = await supabase.from("coupon_redemptions").insert({
    coupon_id: params.couponId,
    user_id: params.userId,
    order_id: params.orderId,
    discount_amount: roundMoney(params.discountAmount),
  });

  if (error) {
    const isDuplicate = (error.message ?? "").toLowerCase().includes("duplicate");
    return {
      success: false as const,
      message: isDuplicate
        ? "This coupon was already used."
        : (error.message ?? ERROR_MESSAGE_GENERIC),
      status: 400,
    };
  }

  return { success: true as const };
}

/** Release a reserved redemption when online payment fails / order cancelled. */
export async function releaseCouponRedemptionForOrder(
  supabase: SupabaseClient,
  orderId: string,
) {
  await supabase.from("coupon_redemptions").delete().eq("order_id", orderId);
}
