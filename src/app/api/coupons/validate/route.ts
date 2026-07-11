import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/account/profile";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateCouponForUser } from "@/lib/supabase/coupons/coupons";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      code?: string;
      subtotal?: number;
    };

    const supabase = await createClient();
    const session = await getCurrentUser(supabase);
    // Admin client for reliable lookup; still enforce per-user redemption when signed in.
    const result = await validateCouponForUser(createAdminClient(), {
      code: body.code ?? "",
      subtotal: Number(body.subtotal) || 0,
      userId: session?.authUser.id ?? null,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        coupon: result.coupon,
        discountAmount: result.discountAmount,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Validate Coupon API",
      meta: { url: "/api/coupons/validate", method: "POST", status: 500 },
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
