import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrderWithSupabase } from "@/lib/supabase/orders";
import { getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import type { CheckoutPayload, FulfillmentType, PaymentMethod } from "@/types/order";

function isFulfillmentType(value: unknown): value is FulfillmentType {
  return value === "delivery" || value === "pickup" || value === "dine_in";
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return (
    value === "cod" ||
    value === "paypal" ||
    value === "amazon" ||
    value === "card"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<CheckoutPayload>;

    const supabase = await createClient();
    const session = await getCurrentUser(supabase);
    const userId = session?.authUser.id ?? null;

    const adminClient = createAdminClient();
    const result = await createOrderWithSupabase(adminClient, body as CheckoutPayload, userId);

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

    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
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
