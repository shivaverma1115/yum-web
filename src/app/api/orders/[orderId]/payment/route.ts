import { NextRequest, NextResponse } from "next/server";
import { assertOrderOwner } from "@/lib/auth/order-access";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { notifyPaymentUpdate } from "@/lib/notifications/notify";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  completeOrderPaymentWithSupabase,
  failOrderPaymentWithSupabase,
} from "@/lib/supabase/orders";
import type { PaymentStatus } from "@/types/order";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { orderId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (body.action && body.action !== "failed") {
      return NextResponse.json(
        { success: false, message: "Unsupported payment action." },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const { data: existingOrder } = await adminClient
      .from("orders")
      .select("user_id, payment_status")
      .eq("id", orderId)
      .maybeSingle();

    const access = assertOrderOwner(auth, existingOrder?.user_id);
    if (!access.allowed) {
      return NextResponse.json(
        { success: false, message: access.message },
        { status: access.status },
      );
    }

    const previousPaymentStatus = existingOrder?.payment_status as
      | PaymentStatus
      | undefined;

    if (body.action === "failed") {
      const result = await failOrderPaymentWithSupabase(
        adminClient,
        orderId,
        { razorpay_payment_id: body.razorpay_payment_id },
        "client",
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      if (result.order) {
        notifyPaymentUpdate(result.order, previousPaymentStatus);
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

    const result = await completeOrderPaymentWithSupabase(
      adminClient,
      orderId,
      {
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      },
      "client",
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    if (result.order) {
      notifyPaymentUpdate(result.order, previousPaymentStatus);
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
