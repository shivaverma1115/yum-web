import type { SupabaseClient } from "@supabase/supabase-js";
import type { BadgeColor } from "@/lib/badge-colors";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay/server";
import type {
  IOrder,
  IOrderItem,
  IOrderWithItems,
  OrderStatus,
} from "@/types/order";
import type { CheckoutPayload } from "@/types/checkout";
import { getProfileByUserId } from "@/lib/supabase/account/profile";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "cancelled",
  "completed",
];

export type CreateOrderResult =
  | { success: true; order: IOrder; items: IOrderItem[] }
  | { success: false; message: string; status: number; errors?: Record<string, string> };

export async function createOrderWithSupabase(
  supabase: SupabaseClient,
  payload: CheckoutPayload,
  userId: string,
): Promise<CreateOrderResult> {
  if (!userId?.trim()) {
    return {
      success: false,
      message: "Customer account is required to place an order.",
      status: 400,
      errors: { user_id: "Missing customer account." },
    };
  }

  if (!payload.items.length) {
    return {
      success: false,
      message: "Your cart is empty.",
      status: 400,
      errors: { items: "Add at least one product." },
    };
  }

  const isOnlinePending = payload.payment_method === "online" && payload.payment_phase === "pending";

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

  const profile = await getProfileByUserId(supabase, userId);
  const checkoutPhone = payload.phone?.trim();
  const profilePhone = profile?.phone?.trim();

  const orderRow = {
    user_id: userId,
    fulfillment_type: payload.fulfillment_type,
    status: "pending" as const,
    payment_method: payload.payment_method,
    payment_status: payload.payment_method === "online" ? isOnlinePending ? ("pending" as const) : ("paid" as const) : ("pending" as const),
    razorpay_order_id: payload.payment_method === "online" ? payload.razorpay_order_id?.trim() ?? null : null,
    razorpay_payment_id: payload.payment_method === "online" && !isOnlinePending ? payload.razorpay_payment_id?.trim() ?? null : null,
    subtotal,
    total: subtotal,
    customer_phone:
      checkoutPhone && checkoutPhone !== "-"
        ? checkoutPhone
        : profilePhone && profilePhone !== "-"
          ? profilePhone
          : "-",
    delivery_address: payload.fulfillment_type === "delivery" ? payload.address?.trim() ?? null : null,
    table_number: payload.fulfillment_type === "dine_in" ? payload.table_number?.trim() ?? null : null,
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

export async function findOrderByRazorpayOrderId(
  supabase: SupabaseClient,
  razorpayOrderId: string,
): Promise<IOrder | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (error || !data) return null;
  return data as IOrder;
}

export async function prepareOrderPaymentRetryWithSupabase(
  supabase: SupabaseClient,
  orderId: string,
  razorpayOrderId: string,
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
    return {
      success: false,
      message: "This order does not use online payment.",
      status: 400,
    };
  }

  if (order.payment_status === "paid") {
    return {
      success: false,
      message: "This order is already paid.",
      status: 400,
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      razorpay_order_id: razorpayOrderId,
      payment_status: "pending",
      razorpay_payment_id: null,
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

export async function getOrderByIdWithSupabase(
  supabase: SupabaseClient,
  orderId: string,
): Promise<{ success: true; order: IOrder } | { success: false; message: string; status: number }> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return { success: false, message: "Order not found.", status: 404 };
  }

  return { success: true, order: data as IOrder };
}

export type CustomerOrdersFilter = "all" | "paid" | "failed" | "cancelled";

export const ORDER_LIST_FILTERS: CustomerOrdersFilter[] = [
  "all",
  "paid",
  "failed",
  "cancelled",
];

export function parseOrderListFilter(
  value: string | null,
): CustomerOrdersFilter {
  if (value && ORDER_LIST_FILTERS.includes(value as CustomerOrdersFilter)) {
    return value as CustomerOrdersFilter;
  }
  return "all";
}

export type ListCustomerOrdersResult =
  | {
      success: true;
      orders: IOrderWithItems[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    }
  | { success: false; message: string; status: number };

export type ListAllOrdersResult = ListCustomerOrdersResult;

type OrderRowWithItems = IOrder & {
  order_items?: IOrderItem[];
};

function mapOrderRowsWithItems(data: OrderRowWithItems[] | null): IOrderWithItems[] {
  return (data ?? []).map((row) => {
    const { order_items, ...order } = row;
    return {
      ...(order as IOrder),
      items: (order_items ?? []) as IOrderItem[],
    };
  });
}

export async function listAllOrdersWithSupabase(
  supabase: SupabaseClient,
  options?: {
    filter?: CustomerOrdersFilter;
    page?: number;
    limit?: number;
  },
): Promise<ListAllOrdersResult> {
  const filter = options?.filter ?? "all";
  const shouldPaginate =
    options?.page !== undefined || options?.limit !== undefined;
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(100, Math.max(1, options?.limit ?? 10));
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", shouldPaginate ? { count: "exact" } : undefined)
    .order("created_at", { ascending: false });

  if (filter === "paid") {
    query = query.eq("payment_status", "paid");
  } else if (filter === "failed") {
    query = query.eq("payment_status", "failed");
  } else if (filter === "cancelled") {
    query = query.eq("status", "cancelled");
  }

  const { data, error, count } = shouldPaginate
    ? await query.range(offset, offset + limit - 1)
    : await query;

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  const orders = mapOrderRowsWithItems(data as OrderRowWithItems[]);

  if (!shouldPaginate) {
    return { success: true, orders };
  }

  const total = count ?? 0;

  return {
    success: true,
    orders,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function listCustomerOrdersWithSupabase(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    filter?: CustomerOrdersFilter;
    page?: number;
    limit?: number;
  },
): Promise<ListCustomerOrdersResult> {
  const filter = options?.filter ?? "all";
  const shouldPaginate =
    options?.page !== undefined || options?.limit !== undefined;
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(100, Math.max(1, options?.limit ?? 10));
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", shouldPaginate ? { count: "exact" } : undefined)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    return shouldPaginate
      ? { success: true, orders: [], total: 0, page, limit, totalPages: 1 }
      : { success: true, orders: [] };
  }

  if (filter === "paid") {
    query = query.eq("payment_status", "paid");
  } else if (filter === "failed") {
    query = query.eq("payment_status", "failed");
  } else if (filter === "cancelled") {
    query = query.eq("status", "cancelled");
  }

  const { data, error, count } = shouldPaginate
    ? await query.range(offset, offset + limit - 1)
    : await query;

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  const orders = mapOrderRowsWithItems(data as OrderRowWithItems[]);

  if (!shouldPaginate) {
    return { success: true, orders };
  }

  const total = count ?? 0;

  return {
    success: true,
    orders,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function updateOrderStatusWithSupabase(
  supabase: SupabaseClient,
  orderId: string,
  status: OrderStatus,
): Promise<
  { success: true; order: IOrder } | { success: false; message: string; status: number }
> {
  if (!ORDER_STATUSES.includes(status)) {
    return {
      success: false,
      message: "Invalid order status.",
      status: 400,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Failed to update order status.",
      status: 400,
    };
  }

  return { success: true, order: data as IOrder };
}

export function getOrderPaymentStatus(order: IOrder): {
  label: string;
  color: BadgeColor;
} {
  if (order.payment_status === 'pending') {
    return {
      label: "Pending",
      color: "amber",
    };
  }

  if (order.payment_status === "paid") {
    return {
      label: "Paid",
      color: "green",
    };
  }

  if (order.payment_status === "failed") {
    return {
      label: "Failed",
      color: "red",
    };
  }

  return {
    label: "Pending",
    color: "amber",
  };
}
