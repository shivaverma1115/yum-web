import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
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

  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const orderRow = {
    user_id: userId ?? null,
    fulfillment_type: payload.fulfillment_type,
    status: "pending" as const,
    payment_method: payload.payment_method,
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
