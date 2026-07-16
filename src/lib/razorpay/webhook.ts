import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  assertPaymentStatusTransition,
  normalizePaymentStatus,
} from "@/lib/orders/payment-transitions";
import {
  notifyOrderPlaced,
  notifyPaymentUpdate,
} from "@/lib/notifications/notify";
import {
  fetchRazorpayPayment,
  razorpayAmountMatchesOrderTotal,
} from "@/lib/razorpay/server";
import {
  failOrderPaymentWithSupabase,
  findOrderByRazorpayOrderId,
} from "@/lib/supabase/orders";
import type { IOrder } from "@/types/order";

export type RazorpayWebhookResult =
  | { success: true; handled: boolean; order?: IOrder }
  | { success: false; message: string; status: number };

export type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        amount?: number;
      };
    };
    order?: { entity?: { id?: string; amount?: number } };
  };
};

function getRazorpayOrderIdFromWebhook(body: RazorpayWebhookPayload): string | null {
  const paymentEntity = body.payload?.payment?.entity;
  const orderEntity = body.payload?.order?.entity;

  const fromPayment = paymentEntity?.order_id?.trim();
  if (fromPayment) return fromPayment;

  const fromOrder = orderEntity?.id?.trim();
  if (fromOrder) return fromOrder;

  return null;
}

export async function handleRazorpayWebhook(
  supabase: SupabaseClient,
  body: RazorpayWebhookPayload,
): Promise<RazorpayWebhookResult> {
  const event = body.event?.trim();
  const razorpayOrderId = getRazorpayOrderIdFromWebhook(body);

  if (!event || !razorpayOrderId) {
    return { success: true, handled: false };
  }

  const order = await findOrderByRazorpayOrderId(supabase, razorpayOrderId);
  if (!order?.id) {
    return { success: true, handled: false };
  }

  const paymentEntity = body.payload?.payment?.entity;
  const razorpayPaymentId = paymentEntity?.id?.trim();
  const currentStatus = normalizePaymentStatus(order.payment_status);

  if (event === "payment.captured" || event === "order.paid") {
    if (currentStatus === "paid") {
      return { success: true, handled: true, order };
    }

    let paidAmountPaise =
      paymentEntity?.amount ?? body.payload?.order?.entity?.amount;

    if (paidAmountPaise == null && razorpayPaymentId) {
      try {
        const payment = await fetchRazorpayPayment(razorpayPaymentId);
        paidAmountPaise = Number(payment.amount);
      } catch {
        return {
          success: false,
          message: "Could not verify payment amount with Razorpay.",
          status: 400,
        };
      }
    }

    if (
      paidAmountPaise == null ||
      !razorpayAmountMatchesOrderTotal(paidAmountPaise, Number(order.total))
    ) {
      return {
        success: false,
        message: "Paid amount does not match the order total.",
        status: 400,
      };
    }

    const transition = assertPaymentStatusTransition(
      "webhook",
      currentStatus,
      "paid",
    );
    if (!transition.ok) {
      return { success: false, message: transition.message, status: 400 };
    }

    const { data: updated, error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        ...(razorpayPaymentId ? { razorpay_payment_id: razorpayPaymentId } : {}),
      })
      .eq("id", order.id)
      .select("*")
      .single();

    if (error || !updated) {
      return {
        success: false,
        message: error?.message ?? ERROR_MESSAGE_GENERIC,
        status: 400,
      };
    }

    await notifyOrderPlaced(updated as IOrder);

    return { success: true, handled: true, order: updated as IOrder };
  }

  if (event === "payment.failed") {
    const result = await failOrderPaymentWithSupabase(
      supabase,
      order.id,
      { razorpay_payment_id: razorpayPaymentId },
      "webhook",
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        status: result.status,
      };
    }

    if (result.order) {
      await notifyPaymentUpdate(result.order, currentStatus);
    }

    return { success: true, handled: true, order: result.order };
  }

  if (event === "payment.pending" || event === "payment.authorized") {
    if (currentStatus === "paid") {
      return { success: true, handled: true, order };
    }

    const transition = assertPaymentStatusTransition(
      "webhook",
      currentStatus,
      "pending",
    );
    if (!transition.ok) {
      return { success: true, handled: true, order };
    }

    const { data: updated, error } = await supabase
      .from("orders")
      .update({
        payment_status: "pending",
        ...(razorpayPaymentId ? { razorpay_payment_id: razorpayPaymentId } : {}),
      })
      .eq("id", order.id)
      .select("*")
      .single();

    if (error || !updated) {
      return {
        success: false,
        message: error?.message ?? ERROR_MESSAGE_GENERIC,
        status: 400,
      };
    }

    await notifyPaymentUpdate(updated as IOrder, order.payment_status);

    return { success: true, handled: true, order: updated as IOrder };
  }

  return { success: true, handled: false };
}
