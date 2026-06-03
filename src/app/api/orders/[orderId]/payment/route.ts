import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  completeOrderPaymentWithSupabase,
  failOrderPaymentWithSupabase,
} from "@/lib/supabase/orders";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const adminClient = createAdminClient();

    if (body.action === "failed") {
      const result = await failOrderPaymentWithSupabase(adminClient, orderId, {
        razorpay_payment_id: body.razorpay_payment_id,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment marked as failed.",
        data: { order: result.order },
      });
    }

    const paymentId = body.razorpay_payment_id?.trim();
    const signature = body.razorpay_signature?.trim();

    if (!paymentId || !signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment id and signature are required.",
        },
        { status: 400 },
      );
    }

    const result = await completeOrderPaymentWithSupabase(adminClient, orderId, {
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully.",
      data: { order: result.order },
    });
  } catch (error) {
    logError(error, {
      context: "Order Payment API",
      meta: { url: "/api/orders/[orderId]/payment", method: "PATCH", status: 500 },
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
