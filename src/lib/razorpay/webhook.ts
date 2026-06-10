import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
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
    payment?: { entity?: { id?: string; order_id?: string; status?: string } };
    order?: { entity?: { id?: string } };
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

  if (event === "payment.captured" || event === "order.paid") {
    if (order.payment_status === "paid") {
      return { success: true, handled: true, order };
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

    return { success: true, handled: true, order: updated as IOrder };
  }

  if (event === "payment.failed") {
    const result = await failOrderPaymentWithSupabase(supabase, order.id, {
      razorpay_payment_id: razorpayPaymentId,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        status: result.status,
      };
    }

    return { success: true, handled: true, order: result.order };
  }

  if (event === "payment.pending" || event === "payment.authorized") {
    if (order.payment_status === "paid") {
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

    return { success: true, handled: true, order: updated as IOrder };
  }

  return { success: true, handled: false };
}
