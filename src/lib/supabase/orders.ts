import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay/server";
import type { CheckoutPayload, IOrder, IOrderItem } from "@/types/order";

export type CreateOrderResult =
  | { success: true; order: IOrder; items: IOrderItem[] }
  | { success: false; message: string; status: number; errors?: Record<string, string> };

export async function createOrderWithSupabase(
  supabase: SupabaseClient,
  payload: CheckoutPayload,
  userId?: string | null,
): Promise<CreateOrderResult> {
  if (!payload.items.length) {
    return {
      success: false,
      message: "Your cart is empty.",
      status: 400,
      errors: { items: "Add at least one product." },
    };
  }

  const isOnlinePending =
    payload.payment_method === "online" && payload.payment_phase === "pending";

  if (payload.payment_method === "online" && !isOnlinePending) {
    const orderId = payload.razorpay_order_id?.trim() ?? "";
    const paymentId = payload.razorpay_payment_id?.trim() ?? "";
    const signature = payload.razorpay_signature?.trim() ?? "";

    if (!orderId || !paymentId || !signature) {
      return {
        success: false,
        message: "Online payment verification is required.",
        status: 400,
        errors: { payment_method: "Complete payment first." },
      };
    }

    if (!verifyRazorpayPaymentSignature(orderId, paymentId, signature)) {
      return {
        success: false,
        message: "Payment verification failed. Please try again.",
        status: 400,
        errors: { payment_method: "Invalid payment signature." },
      };
    }
  }

  if (isOnlinePending && !payload.razorpay_order_id?.trim()) {
    return {
      success: false,
      message: "Razorpay order id is required.",
      status: 400,
      errors: { razorpay_order_id: "Missing Razorpay order." },
    };
  }

  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const orderRow = {
    user_id: userId ?? null,
    fulfillment_type: payload.fulfillment_type,
    status: "pending" as const,
    payment_method: payload.payment_method,
    payment_status:
      payload.payment_method === "online"
        ? isOnlinePending
          ? ("pending" as const)
          : ("paid" as const)
        : ("pending" as const),
    razorpay_order_id:
      payload.payment_method === "online" ? payload.razorpay_order_id?.trim() ?? null : null,
    razorpay_payment_id:
      payload.payment_method === "online" && !isOnlinePending
        ? payload.razorpay_payment_id?.trim() ?? null
        : null,
    subtotal,
    total: subtotal,
    customer_first_name: payload.first_name.trim(),
    customer_last_name: payload.last_name.trim(),
    customer_email: payload.email.trim(),
    customer_phone: payload.phone.trim(),
    delivery_address:
      payload.fulfillment_type === "delivery" ? payload.address?.trim() ?? null : null,
    delivery_country:
      payload.fulfillment_type === "delivery" ? payload.country?.trim() ?? null : null,
    delivery_state:
      payload.fulfillment_type === "delivery" ? payload.state?.trim() ?? null : null,
    delivery_city:
      payload.fulfillment_type === "delivery" ? payload.city?.trim() ?? null : null,
    delivery_zip_code:
      payload.fulfillment_type === "delivery" ? payload.zip_code?.trim() ?? null : null,
    pickup_time:
      payload.fulfillment_type === "pickup" ? payload.pickup_time?.trim() ?? null : null,
    table_number:
      payload.fulfillment_type === "dine_in" ? payload.table_number?.trim() ?? null : null,
    party_size:
      payload.fulfillment_type === "dine_in" ? payload.party_size ?? null : null,
    additional_notes: payload.additional_notes?.trim() ?? null,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderRow)
    .select("*")
    .single();

  if (orderError || !order) {
    return {
      success: false,
      message: orderError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  const itemRows = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    image_url: item.imageUrl ?? null,
  }));

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .insert(itemRows)
    .select("*");

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return {
      success: false,
      message: itemsError.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return {
    success: true,
    order: order as IOrder,
    items: (items ?? []) as IOrderItem[],
  };
}

export type CompleteOrderPaymentPayload = {
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type FailOrderPaymentPayload = {
  razorpay_payment_id?: string;
};

export async function completeOrderPaymentWithSupabase(
  supabase: SupabaseClient,
  orderId: string,
  payload: CompleteOrderPaymentPayload,
): Promise<CreateOrderResult> {
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, message: "Order not found.", status: 404 };
  }

  if (order.payment_method !== "online") {
    return { success: false, message: "Order is not an online payment order.", status: 400 };
  }

  if (order.payment_status === "paid") {
    return { success: true, order: order as IOrder, items: [] };
  }

  const razorpayOrderId =
    payload.razorpay_order_id?.trim() || order.razorpay_order_id?.trim() || "";
  const razorpayPaymentId = payload.razorpay_payment_id?.trim() ?? "";
  const razorpaySignature = payload.razorpay_signature?.trim() ?? "";

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return {
      success: false,
      message: "Payment details are incomplete.",
      status: 400,
    };
  }

  if (
    order.razorpay_order_id &&
    order.razorpay_order_id !== razorpayOrderId
  ) {
    return {
      success: false,
      message: "Payment does not match this order.",
      status: 400,
    };
  }

  if (!verifyRazorpayPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return {
      success: false,
      message: "Payment verification failed. Please try again.",
      status: 400,
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (updateError || !updated) {
    return {
      success: false,
      message: updateError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true, order: updated as IOrder, items: [] };
}

export async function failOrderPaymentWithSupabase(
  supabase: SupabaseClient,
  orderId: string,
  payload?: FailOrderPaymentPayload,
): Promise<CreateOrderResult> {
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, message: "Order not found.", status: 404 };
  }

  if (order.payment_method !== "online" || order.payment_status === "paid") {
    return { success: true, order: order as IOrder, items: [] };
  }

  const paymentId = payload?.razorpay_payment_id?.trim();

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      ...(paymentId ? { razorpay_payment_id: paymentId } : {}),
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (updateError || !updated) {
    return {
      success: false,
      message: updateError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true, order: updated as IOrder, items: [] };
}
