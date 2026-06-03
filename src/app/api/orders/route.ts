import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { validateCheckoutPayload } from "@/lib/checkout/validate-order-payload";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrderWithSupabase } from "@/lib/supabase/orders";
import { getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import type { CheckoutPayload } from "@/types/order";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<CheckoutPayload>;
    const validation = validateCheckoutPayload(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
          errors: validation.errors ?? {},
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const session = await getCurrentUser(supabase);
    const userId = session?.authUser.id ?? null;

    const adminClient = createAdminClient();
    const result = await createOrderWithSupabase(
      adminClient,
      validation.data,
      userId,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors ?? {},
        },
        { status: result.status },
      );
    }

    const isPendingOnline =
      validation.data.payment_method === "online" &&
      validation.data.payment_phase === "pending";

    return NextResponse.json({
      success: true,
      message: isPendingOnline
        ? "Order created. Complete payment to confirm."
        : "Order placed successfully.",
      data: {
        order: result.order,
        items: result.items,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Create Order API",
      meta: { url: "/api/orders", method: "POST", status: 500 },
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
