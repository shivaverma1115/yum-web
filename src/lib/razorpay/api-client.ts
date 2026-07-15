import type { RazorpayCheckoutResponse, RazorpayCreateOrderData } from "@/lib/razorpay/types";
import type { CheckoutLinePayload } from "@/types/checkout";
import type { FulfillmentType } from "@/types/order";
import { waitForOrderPaymentStatus } from "./poll-payment";

type ApiResult<T> =
  | { success: true; message?: string; data: T }
  | { success: false; message: string };

async function parseJson<T>(response: Response): Promise<T> {
  return response.json().catch(() => ({})) as Promise<T>;
}

export type CreateRazorpayPaymentQuoteInput = {
  fulfillment_type: FulfillmentType;
  coupon_code?: string | null;
  items: CheckoutLinePayload[];
};

export async function createRazorpayPaymentOrder(
  quote: CreateRazorpayPaymentQuoteInput,
): Promise<RazorpayCreateOrderData> {
  const response = await fetch("/api/payments/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(quote),
  });

  const data = await parseJson<ApiResult<RazorpayCreateOrderData>>(response);

  if (!response.ok || !data.success) {
    throw new Error(
      (data as { message?: string }).message ?? "Could not start online payment.",
    );
  }

  return data.data;
}

export async function confirmOrderPayment(
  orderId: string,
  payment: RazorpayCheckoutResponse,
): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,
    }),
  });

  const data = await parseJson<{ success?: boolean; message?: string }>(response);

  if (response.ok && data.success) {
    return;
  }

  await waitForOrderPaymentStatus(orderId);
}

export async function markOrderPaymentFailed(
  orderId: string,
  razorpayPaymentId?: string,
): Promise<void> {
  await fetch(`/api/orders/${orderId}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "failed",
      razorpay_payment_id: razorpayPaymentId,
    }),
  });
}

export async function retryOrderPaymentSession(
  orderId: string,
): Promise<RazorpayCreateOrderData> {
  const response = await fetch(`/api/orders/${orderId}/payment/retry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseJson<ApiResult<RazorpayCreateOrderData>>(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Could not restart payment.");
  }

  return data.data;
}
