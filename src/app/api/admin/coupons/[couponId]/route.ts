import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { parseCouponFormPayload } from "@/lib/coupons/discount";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteCouponWithSupabase,
  updateCouponWithSupabase,
} from "@/lib/supabase/coupons/coupons";

type RouteContext = { params: Promise<{ couponId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { couponId } = await context.params;
    if (!couponId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Coupon id is required." },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = parseCouponFormPayload(body, { partial: true });
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.message,
          errors: parsed.errors,
        },
        { status: 400 },
      );
    }

    const result = await updateCouponWithSupabase(
      createAdminClient(),
      couponId,
      parsed.payload,
    );
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully.",
      data: { coupon: result.coupon },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Update Coupon API",
      meta: { url: "/api/admin/coupons/[couponId]", method: "PATCH", status: 500 },
    });
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { couponId } = await context.params;
    if (!couponId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Coupon id is required." },
        { status: 400 },
      );
    }

    const result = await deleteCouponWithSupabase(
      createAdminClient(),
      couponId,
    );
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Admin Delete Coupon API",
      meta: { url: "/api/admin/coupons/[couponId]", method: "DELETE", status: 500 },
    });
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}
