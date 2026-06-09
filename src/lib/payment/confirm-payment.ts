import type { RazorpayCheckoutResponse } from "@/lib/razorpay/client";
import { waitForOrderPaymentStatus } from "@/lib/checkout/wait-for-payment";

type ConfirmPaymentResponse = {
  success?: boolean;
  message?: string;
};

/** Confirm payment via server signature check; fall back to polling if needed. */
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

  const data = (await response.json().catch(() => ({}))) as ConfirmPaymentResponse;

  if (response.ok && data.success) {
    return;
  }

  // Webhook may still be processing — poll as a fallback.
  await waitForOrderPaymentStatus(orderId);
}
