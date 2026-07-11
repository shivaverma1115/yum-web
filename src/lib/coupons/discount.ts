import type {
  AppliedCoupon,
  CouponDiscountType,
  CouponFormPayload,
  ICoupon,
} from "@/types/coupon";

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function computeCouponDiscountAmount(
  coupon: Pick<
    AppliedCoupon,
    "discount_type" | "discount_value" | "max_discount_amount"
  >,
  orderSubtotal: number,
): number {
  const subtotal = Math.max(0, orderSubtotal);
  if (subtotal <= 0) return 0;

  let discount =
    coupon.discount_type === "percent"
      ? (subtotal * coupon.discount_value) / 100
      : coupon.discount_value;

  if (
    coupon.max_discount_amount != null &&
    Number.isFinite(coupon.max_discount_amount)
  ) {
    discount = Math.min(discount, coupon.max_discount_amount);
  }

  return roundMoney(Math.min(Math.max(0, discount), subtotal));
}

export function couponToApplied(coupon: ICoupon): AppliedCoupon {
  return {
    id: coupon.id,
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: Number(coupon.discount_value),
    min_order_amount: Number(coupon.min_order_amount) || 0,
    max_discount_amount:
      coupon.max_discount_amount == null
        ? null
        : Number(coupon.max_discount_amount),
  };
}

function parseOptionalDate(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export type ParseCouponResult =
  | { success: true; payload: CouponFormPayload }
  | {
      success: false;
      message: string;
      errors: Record<string, string>;
    };

export function parseCouponFormPayload(
  body: unknown,
  options: { partial?: boolean } = {},
): ParseCouponResult {
  const partial = options.partial === true;
  const raw = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  let code: string | undefined;
  if (raw.code !== undefined || !partial) {
    const normalized = normalizeCouponCode(String(raw.code ?? ""));
    if (!normalized) {
      errors.code = "Coupon code is required.";
    } else if (normalized.length > 32) {
      errors.code = "Coupon code must be 32 characters or fewer.";
    } else if (!/^[A-Z0-9_-]+$/.test(normalized)) {
      errors.code = "Use letters, numbers, hyphens, or underscores only.";
    } else {
      code = normalized;
    }
  }

  let discount_type: CouponDiscountType | undefined;
  if (raw.discount_type !== undefined || !partial) {
    const type = String(raw.discount_type ?? "").trim();
    if (type !== "percent" && type !== "fixed") {
      errors.discount_type = "Choose percent or fixed.";
    } else {
      discount_type = type;
    }
  }

  let discount_value: number | undefined;
  if (raw.discount_value !== undefined || !partial) {
    const value = Number(raw.discount_value);
    if (!Number.isFinite(value) || value <= 0) {
      errors.discount_value = "Enter a discount greater than 0.";
    } else {
      discount_value = roundMoney(value);
    }
  }

  const resolvedType = discount_type;
  if (
    resolvedType === "percent" &&
    discount_value != null &&
    discount_value > 100
  ) {
    errors.discount_value = "Percent discount cannot exceed 100.";
  }

  let min_order_amount: number | undefined;
  if (raw.min_order_amount !== undefined) {
    const value = Number(raw.min_order_amount);
    if (!Number.isFinite(value) || value < 0) {
      errors.min_order_amount = "Minimum order must be 0 or more.";
    } else {
      min_order_amount = roundMoney(value);
    }
  } else if (!partial) {
    min_order_amount = 0;
  }

  let max_discount_amount: number | null | undefined;
  if (raw.max_discount_amount !== undefined) {
    if (raw.max_discount_amount === null || raw.max_discount_amount === "") {
      max_discount_amount = null;
    } else {
      const value = Number(raw.max_discount_amount);
      if (!Number.isFinite(value) || value <= 0) {
        errors.max_discount_amount = "Max discount must be greater than 0.";
      } else {
        max_discount_amount = roundMoney(value);
      }
    }
  }

  const starts_at = parseOptionalDate(raw.starts_at);
  if (raw.starts_at !== undefined && starts_at === undefined) {
    errors.starts_at = "Invalid start date.";
  }

  const ends_at = parseOptionalDate(raw.ends_at);
  if (raw.ends_at !== undefined && ends_at === undefined) {
    errors.ends_at = "Invalid end date.";
  }

  if (
    starts_at &&
    ends_at &&
    new Date(starts_at).getTime() > new Date(ends_at).getTime()
  ) {
    errors.ends_at = "End date must be on or after the start date.";
  }

  let description: string | null | undefined;
  if (raw.description !== undefined) {
    const text = String(raw.description ?? "").trim();
    description = text || null;
  }

  let is_active: boolean | undefined;
  if (raw.is_active !== undefined) {
    is_active = Boolean(raw.is_active);
  } else if (!partial) {
    is_active = true;
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the coupon details.",
      errors,
    };
  }

  const payload: CouponFormPayload = {
    ...(code !== undefined ? { code } : { code: "" }),
    ...(discount_type !== undefined
      ? { discount_type }
      : { discount_type: "percent" }),
    ...(discount_value !== undefined
      ? { discount_value }
      : { discount_value: 0 }),
  };

  if (description !== undefined) payload.description = description;
  if (min_order_amount !== undefined) payload.min_order_amount = min_order_amount;
  if (max_discount_amount !== undefined) {
    payload.max_discount_amount = max_discount_amount;
  }
  if (starts_at !== undefined) payload.starts_at = starts_at;
  if (ends_at !== undefined) payload.ends_at = ends_at;
  if (is_active !== undefined) payload.is_active = is_active;

  if (partial) {
    const partialPayload = { ...payload } as Partial<CouponFormPayload> &
      Record<string, unknown>;
    if (code === undefined) delete partialPayload.code;
    if (discount_type === undefined) delete partialPayload.discount_type;
    if (discount_value === undefined) delete partialPayload.discount_value;
    return {
      success: true,
      payload: partialPayload as CouponFormPayload,
    };
  }

  return { success: true, payload };
}

export function isCouponCurrentlyValid(
  coupon: Pick<ICoupon, "is_active" | "starts_at" | "ends_at">,
  now = new Date(),
): boolean {
  if (!coupon.is_active) return false;
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now.getTime()) {
    return false;
  }
  if (coupon.ends_at && new Date(coupon.ends_at).getTime() < now.getTime()) {
    return false;
  }
  return true;
}
