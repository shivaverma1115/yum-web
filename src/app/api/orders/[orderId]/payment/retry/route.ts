import { NextResponse } from "next/server";
import { assertOrderOwner } from "@/lib/auth/order-access";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  createRazorpayOrder,
  getRazorpayCurrency,
  getRazorpayKeyId,
  toRazorpayAmount,
} from "@/lib/razorpay/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getOrderByIdWithSupabase,
  prepareOrderPaymentRetryWithSupabase,
} from "@/lib/supabase/orders";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function POST(_: Request, context: RouteContext) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { orderId } = await context.params;
    const adminClient = createAdminClient();
    const orderResult = await getOrderByIdWithSupabase(adminClient, orderId);

    if (!orderResult.success) {
      return NextResponse.json(
        { success: false, message: orderResult.message },
        { status: orderResult.status },
      );
    }

    const access = assertOrderOwner(auth, orderResult.order.user_id);
    if (!access.allowed) {
      return NextResponse.json(
        { success: false, message: access.message },
        { status: access.status },
      );
    }

    const receipt = `yum_retry_${orderId.slice(0, 8)}_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(
      orderResult.order.total,
      receipt,
    );
    const currency = getRazorpayCurrency();

    const prepareResult = await prepareOrderPaymentRetryWithSupabase(
      adminClient,
      orderId,
      razorpayOrder.id,
    );

    if (!prepareResult.success) {
      return NextResponse.json(
        { success: false, message: prepareResult.message },
        { status: prepareResult.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        keyId: getRazorpayKeyId(),
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount ?? toRazorpayAmount(orderResult.order.total),
        currency: razorpayOrder.currency ?? currency,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Order Payment Retry API",
      meta: {
        url: "/api/orders/[orderId]/payment/retry",
        method: "POST",
        status: 500,
      },
    });

    const message =
      error instanceof Error && error.message.includes("RAZORPAY")
        ? "Online payments are not configured. Contact support."
        : error instanceof Error
          ? error.message
          : ERROR_MESSAGE_GENERIC;

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
