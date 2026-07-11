import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { parseCouponFormPayload } from "@/lib/coupons/discount";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createCouponWithSupabase,
  listCouponsWithSupabase,
} from "@/lib/supabase/coupons/coupons";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const result = await listCouponsWithSupabase(createAdminClient());
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { coupons: result.coupons },
    });
  } catch (error) {
    logError(error, {
      context: "Admin List Coupons API",
      meta: { url: "/api/admin/coupons", method: "GET", status: 500 },
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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = parseCouponFormPayload(body);
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

    const result = await createCouponWithSupabase(
      createAdminClient(),
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
      message: "Coupon created successfully.",
      data: { coupon: result.coupon },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Create Coupon API",
      meta: { url: "/api/admin/coupons", method: "POST", status: 500 },
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
