import {
  PAYMENT_POLL_INTERVAL_MS,
  PAYMENT_POLL_MAX_ATTEMPTS,
} from "@/lib/razorpay/constants";
import type { PaymentStatus } from "@/types/order";

type OrderStatusResponse = {
  success?: boolean;
  data?: {
    order?: {
      payment_status?: PaymentStatus;
    };
  };
};

export type PaymentWatchResult =
  | { status: "paid" }
  | { status: "failed" }
  | { status: "pending" };

async function fetchOrderPaymentStatus(
  orderId: string,
  signal?: AbortSignal,
): Promise<PaymentStatus | null> {
  const response = await fetch(`/api/orders/${orderId}`, {
    cache: "no-store",
    credentials: "include",
    signal,
  });
  const data = (await response.json().catch(() => ({}))) as OrderStatusResponse;

  if (!response.ok || !data.success) {
    throw new Error("Could not verify payment status.");
  }

  return data.data?.order?.payment_status ?? null;
}

export async function watchOrderPaymentStatus(
  orderId: string,
  signal?: AbortSignal,
): Promise<PaymentWatchResult> {
  let lastStatus: PaymentStatus | null = null;

  for (let attempt = 0; attempt < PAYMENT_POLL_MAX_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) {
      throw new Error("Payment confirmation cancelled.");
    }

    const status = await fetchOrderPaymentStatus(orderId, signal);
    lastStatus = status;

    if (status === "paid") {
      return { status: "paid" };
    }

    // Keep polling after a failed status — a retry may succeed via webhook.
    await new Promise((resolve) => setTimeout(resolve, PAYMENT_POLL_INTERVAL_MS));
  }

  if (lastStatus === "failed") {
    return { status: "failed" };
  }

  return { status: "pending" };
}

export async function waitForOrderPaymentStatus(
  orderId: string,
  signal?: AbortSignal,
): Promise<PaymentStatus> {
  const result = await watchOrderPaymentStatus(orderId, signal);

  if (result.status === "paid") return "paid";
  if (result.status === "failed") {
    throw new Error("Payment failed. Please try again.");
  }

  throw new Error(
    "Payment is still processing. If amount was deducted, contact support with your order reference.",
  );
}
