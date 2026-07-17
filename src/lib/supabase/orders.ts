import type { SupabaseClient } from "@supabase/supabase-js";
import type { BadgeColor } from "@/lib/badge-colors";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  assertPaymentStatusTransition,
  normalizePaymentStatus,
  type PaymentTransitionActor,
} from "@/lib/orders/payment-transitions";
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  razorpayAmountMatchesOrderTotal,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay/server";
import type {
  IOrder,
  IOrderItem,
  IOrderWithItems,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";
import type { CheckoutPayload } from "@/types/checkout";
import { getProfileByUserId } from "@/lib/supabase/account/profile";
import {
  redeemCouponForOrder,
  releaseCouponRedemptionForOrder,
} from "@/lib/supabase/coupons/coupons";
import { allocateOrderNumber } from "@/lib/orders/order-number";
import { buildServerOrderQuote } from "@/lib/orders/reprice-cart";
import { getBusinessSettings } from "@/lib/business-settings";

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

  const settings = await getBusinessSettings();
  if (
    payload.payment_method === "cash_on_delivery" &&
    !settings.order.cod_enabled
  ) {
    return {
      success: false,
      message: "Cash on delivery is not available.",
      status: 400,
      errors: { payment_method: "COD disabled." },
    };
  }
  if (
    payload.payment_method === "online" &&
    !settings.order.online_payment_enabled
  ) {
    return {
      success: false,
      message: "Online payment is not available.",
      status: 400,
      errors: { payment_method: "Online payment disabled." },
    };
  }

  const quote = await buildServerOrderQuote(supabase, {
    items: payload.items,
    fulfillment_type: payload.fulfillment_type,
    coupon_code: payload.coupon_code,
    userId,
  });

  if (!quote.success) {
    return {
      success: false,
      message: quote.message,
      status: quote.status,
      errors: quote.errors,
    };
  }

  const {
    lines: pricedLines,
    subtotal,
    discountAmount,
    couponId,
    couponCode,
    total,
  } = quote;

  if (payload.payment_method === "online" && payload.razorpay_order_id?.trim()) {
    try {
      const razorpayOrder = await fetchRazorpayOrder(
        payload.razorpay_order_id.trim(),
      );
      if (
        !razorpayAmountMatchesOrderTotal(razorpayOrder.amount, total)
      ) {
        return {
          success: false,
          message: "Payment amount does not match the order total.",
          status: 400,
          errors: { payment_method: "Amount mismatch." },
        };
      }
    } catch {
      return {
        success: false,
        message: "Could not verify Razorpay order.",
        status: 400,
        errors: { razorpay_order_id: "Invalid Razorpay order." },
      };
    }
  }

  let orderNumber: string;
  try {
    orderNumber = await allocateOrderNumber(supabase);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to allocate order number.",
      status: 500,
    };
  }

  const profile = await getProfileByUserId(supabase, userId);
  const checkoutPhone = payload.phone?.trim();
  const profilePhone = profile?.phone?.trim();

  const orderRow = {
    user_id: userId,
    order_number: orderNumber,
    fulfillment_type: payload.fulfillment_type,
    status: "pending" as const,
    payment_method: payload.payment_method,
    payment_status: payload.payment_method === "online" ? isOnlinePending ? ("pending" as const) : ("paid" as const) : ("pending" as const),
    razorpay_order_id: payload.payment_method === "online" ? payload.razorpay_order_id?.trim() ?? null : null,
    razorpay_payment_id: payload.payment_method === "online" && !isOnlinePending ? payload.razorpay_payment_id?.trim() ?? null : null,
    subtotal,
    total,
    coupon_id: couponId,
    coupon_code: couponCode,
    discount_amount: discountAmount,
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

  const itemRows = pricedLines.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    image_url: item.image_url,
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

  if (couponId) {
    const redeem = await redeemCouponForOrder(supabase, {
      couponId,
      userId,
      orderId: order.id,
      discountAmount,
    });

    if (!redeem.success) {
      await supabase.from("orders").delete().eq("id", order.id);
      return {
        success: false,
        message: redeem.message,
        status: redeem.status,
        errors: { coupon_code: redeem.message },
      };
    }
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
  actor: PaymentTransitionActor = "client",
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

  const currentStatus = normalizePaymentStatus(order.payment_status);
  const transition = assertPaymentStatusTransition(actor, currentStatus, "paid");
  if (!transition.ok) {
    return { success: false, message: transition.message, status: 400 };
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

  try {
    const payment = await fetchRazorpayPayment(razorpayPaymentId);
    const paymentOrderId =
      typeof payment.order_id === "string" ? payment.order_id : "";
    if (paymentOrderId && paymentOrderId !== razorpayOrderId) {
      return {
        success: false,
        message: "Payment does not match this order.",
        status: 400,
      };
    }
    if (
      !razorpayAmountMatchesOrderTotal(
        payment.amount,
        Number(order.total),
      )
    ) {
      return {
        success: false,
        message: "Paid amount does not match the order total.",
        status: 400,
      };
    }
  } catch {
    return {
      success: false,
      message: "Could not verify payment amount with Razorpay.",
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
  actor: PaymentTransitionActor = "client",
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
    return { success: true, order: order as IOrder, items: [] };
  }

  const currentStatus = normalizePaymentStatus(order.payment_status);
  if (currentStatus === "paid") {
    return { success: true, order: order as IOrder, items: [] };
  }

  const transition = assertPaymentStatusTransition(actor, currentStatus, "failed");
  if (!transition.ok) {
    return { success: false, message: transition.message, status: 400 };
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

  await releaseCouponRedemptionForOrder(supabase, orderId);

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

  const currentStatus = normalizePaymentStatus(order.payment_status);
  const transition = assertPaymentStatusTransition("client", currentStatus, "pending");
  if (!transition.ok) {
    return { success: false, message: transition.message, status: 400 };
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

/**
 * Customer-facing order lookup. Accepts either the internal UUID or the
 * public order number and includes line items for the tracking screen.
 */
export async function getOrderByReferenceWithSupabase(
  supabase: SupabaseClient,
  reference: string,
): Promise<
  | { success: true; order: IOrderWithItems }
  | { success: false; message: string; status: number }
> {
  const normalizedReference = reference.trim();
  if (!normalizedReference) {
    return {
      success: false,
      message: "Enter an order number.",
      status: 400,
    };
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalizedReference,
    );

  let query = supabase.from("orders").select("*, order_items(*)");
  query = isUuid
    ? query.eq("id", normalizedReference)
    : query.eq("order_number", normalizedReference.toUpperCase());

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    return { success: false, message: "Order not found.", status: 404 };
  }

  const row = data as OrderRowWithItems;
  const { order_items, ...order } = row;

  return {
    success: true,
    order: {
      ...(order as IOrder),
      items: (order_items ?? []) as IOrderItem[],
    },
  };
}

export type CustomerOrdersFilter = "all" | "paid" | "failed" | "cancelled";

export const ORDER_LIST_FILTERS: CustomerOrdersFilter[] = [
  "all",
  "paid",
  "failed",
  "cancelled",
];

export type OrderListFilters = {
  dateFrom?: string;
  dateTo?: string;
  orderStatus?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  /** Exact table number from QR codes. */
  tableNumber?: string;
  /** Search phone number or delivery address. */
  search?: string;
};

export const DEFAULT_ORDER_LIST_FILTERS: OrderListFilters = {
  orderStatus: "all",
  paymentStatus: "all",
};

const ORDER_LIST_PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
];

function escapeIlikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

function applyOrderListFilters<
  T extends {
    gte: Function;
    lte: Function;
    eq: Function;
    or: Function;
  },
>(query: T, filters: OrderListFilters): T {
  let nextQuery = query;

  if (filters.dateFrom) {
    nextQuery = nextQuery.gte("created_at", `${filters.dateFrom}T00:00:00.000Z`);
  }

  if (filters.dateTo) {
    nextQuery = nextQuery.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
  }

  if (filters.orderStatus && filters.orderStatus !== "all") {
    nextQuery = nextQuery.eq("status", filters.orderStatus);
  }

  if (filters.paymentStatus && filters.paymentStatus !== "all") {
    nextQuery = nextQuery.eq("payment_status", filters.paymentStatus);
  }

  const tableNumber = filters.tableNumber?.trim();
  if (tableNumber) {
    nextQuery = nextQuery.eq("table_number", tableNumber);
  }

  const search = filters.search?.trim();
  if (search) {
    const term = escapeIlikePattern(search);
    nextQuery = nextQuery.or(
      `customer_phone.ilike.%${term}%,delivery_address.ilike.%${term}%`,
    );
  }

  return nextQuery;
}

export function parseOrderListFilter(
  value: string | null,
): CustomerOrdersFilter {
  if (value && ORDER_LIST_FILTERS.includes(value as CustomerOrdersFilter)) {
    return value as CustomerOrdersFilter;
  }
  return "all";
}

export function parseOrderListFilters(
  searchParams: Pick<URLSearchParams, "get">,
): OrderListFilters {
  const filters: OrderListFilters = { ...DEFAULT_ORDER_LIST_FILTERS };

  const legacyFilter = parseOrderListFilter(searchParams.get("filter"));
  if (legacyFilter === "paid") {
    filters.paymentStatus = "paid";
  } else if (legacyFilter === "failed") {
    filters.paymentStatus = "failed";
  } else if (legacyFilter === "cancelled") {
    filters.orderStatus = "cancelled";
  }

  const dateFrom = searchParams.get("dateFrom")?.trim();
  const dateTo = searchParams.get("dateTo")?.trim();
  const orderStatus = searchParams.get("orderStatus")?.trim();
  const paymentStatus = searchParams.get("paymentStatus")?.trim();
  const tableNumber = searchParams.get("tableNumber")?.trim();
  const search =
    searchParams.get("search")?.trim() ||
    searchParams.get("customerName")?.trim();

  if (dateFrom) filters.dateFrom = dateFrom;
  if (dateTo) filters.dateTo = dateTo;

  if (orderStatus && ORDER_STATUSES.includes(orderStatus as OrderStatus)) {
    filters.orderStatus = orderStatus as OrderStatus;
  }

  if (
    paymentStatus &&
    ORDER_LIST_PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)
  ) {
    filters.paymentStatus = paymentStatus as PaymentStatus;
  }

  if (tableNumber) filters.tableNumber = tableNumber;
  if (search) filters.search = search;

  return filters;
}

export function buildOrderListSearchParams(
  filters: OrderListFilters,
  page?: number,
  limit?: number,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.orderStatus && filters.orderStatus !== "all") {
    params.set("orderStatus", filters.orderStatus);
  }
  if (filters.paymentStatus && filters.paymentStatus !== "all") {
    params.set("paymentStatus", filters.paymentStatus);
  }
  if (filters.tableNumber?.trim()) {
    params.set("tableNumber", filters.tableNumber.trim());
  }
  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (page != null && limit != null) {
    params.set("page", String(page));
    params.set("limit", String(limit));
  }

  return params;
}

export function countActiveOrderListFilters(filters: OrderListFilters): number {
  let count = 0;
  if (filters.dateFrom) count += 1;
  if (filters.dateTo) count += 1;
  if (filters.orderStatus && filters.orderStatus !== "all") count += 1;
  if (filters.paymentStatus && filters.paymentStatus !== "all") count += 1;
  if (filters.tableNumber?.trim()) count += 1;
  if (filters.search?.trim()) count += 1;
  return count;
}

export function formatOrderListFiltersLabel(filters: OrderListFilters): string {
  const count = countActiveOrderListFilters(filters);
  if (count === 0) return "All";
  return `${count} active`;
}

export function orderMatchesListFilters(
  order: IOrder,
  filters: OrderListFilters,
): boolean {
  if (filters.dateFrom && order.created_at) {
    if (order.created_at < `${filters.dateFrom}T00:00:00.000Z`) return false;
  }

  if (filters.dateTo && order.created_at) {
    if (order.created_at > `${filters.dateTo}T23:59:59.999Z`) return false;
  }

  if (
    filters.orderStatus &&
    filters.orderStatus !== "all" &&
    order.status !== filters.orderStatus
  ) {
    return false;
  }

  if (
    filters.paymentStatus &&
    filters.paymentStatus !== "all" &&
    order.payment_status !== filters.paymentStatus
  ) {
    return false;
  }

  const tableNumber = filters.tableNumber?.trim();
  if (tableNumber && order.table_number?.trim() !== tableNumber) {
    return false;
  }

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    const haystack = [order.customer_phone, order.delivery_address]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  return true;
}

export type OrderListStats = {
  totalOrders: number;
  paidRevenue: number;
  pendingCount: number;
};

export type ListCustomerOrdersResult =
  | {
      success: true;
      orders: IOrderWithItems[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      stats?: OrderListStats;
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

function computeOrderListStats(
  rows: Array<{
    total?: number | null;
    payment_status?: string | null;
    status?: string | null;
  }>,
  totalOrders: number,
): OrderListStats {
  let paidRevenue = 0;
  let pendingCount = 0;

  for (const row of rows) {
    if (row.payment_status === "paid") {
      paidRevenue += Number(row.total) || 0;
    }
    if (row.payment_status === "pending" && row.status !== "cancelled") {
      pendingCount += 1;
    }
  }

  return { totalOrders, paidRevenue, pendingCount };
}

async function fetchOrderListStatsWithSupabase(
  supabase: SupabaseClient,
  filters: OrderListFilters,
  totalOrders: number,
): Promise<OrderListStats> {
  let query = supabase
    .from("orders")
    .select("total, payment_status, status");

  query = applyOrderListFilters(query, filters);

  const { data, error } = await query;

  if (error || !data) {
    return {
      totalOrders,
      paidRevenue: 0,
      pendingCount: 0,
    };
  }

  return computeOrderListStats(data, totalOrders);
}

export async function listAllOrdersWithSupabase(
  supabase: SupabaseClient,
  options?: {
    filter?: CustomerOrdersFilter;
    filters?: OrderListFilters;
    page?: number;
    limit?: number;
    includeStats?: boolean;
  },
): Promise<ListAllOrdersResult> {
  const filters =
    options?.filters ??
    (options?.filter && options.filter !== "all"
      ? parseOrderListFilters({
          get: (key) => (key === "filter" ? options.filter ?? null : null),
        })
      : DEFAULT_ORDER_LIST_FILTERS);
  const shouldPaginate =
    options?.page !== undefined || options?.limit !== undefined;
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(100, Math.max(1, options?.limit ?? 10));
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", shouldPaginate ? { count: "exact" } : undefined)
    .order("created_at", { ascending: false });

  query = applyOrderListFilters(query, filters);

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
    const stats = options?.includeStats
      ? computeOrderListStats(orders, orders.length)
      : undefined;
    return { success: true, orders, stats };
  }

  const total = count ?? 0;
  const stats = options?.includeStats
    ? await fetchOrderListStatsWithSupabase(supabase, filters, total)
    : undefined;

  return {
    success: true,
    orders,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    stats,
  };
}

export async function listCustomerOrdersWithSupabase(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    filter?: CustomerOrdersFilter;
    filters?: OrderListFilters;
    page?: number;
    limit?: number;
  },
): Promise<ListCustomerOrdersResult> {
  const filters =
    options?.filters ??
    (options?.filter && options.filter !== "all"
      ? parseOrderListFilters({
          get: (key) => (key === "filter" ? options.filter ?? null : null),
        })
      : DEFAULT_ORDER_LIST_FILTERS);
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

  query = applyOrderListFilters(query, filters);

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

export async function deleteOrderWithSupabase(
  supabase: SupabaseClient,
  orderId: string,
): Promise<
  { success: true } | { success: false; message: string; status: number }
> {
  if (!orderId.trim()) {
    return {
      success: false,
      message: "Order id is required.",
      status: 400,
    };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError) {
    return {
      success: false,
      message: fetchError.message,
      status: 400,
    };
  }

  if (!existing) {
    return {
      success: false,
      message: "Order not found.",
      status: 404,
    };
  }

  const { error } = await supabase.from("orders").delete().eq("id", orderId);

  if (error) {
    return {
      success: false,
      message: error.message,
      status: 400,
    };
  }

  return { success: true };
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
