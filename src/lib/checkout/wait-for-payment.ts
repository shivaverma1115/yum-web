import type { PaymentStatus } from "@/types/order";

type OrderStatusResponse = {
  success?: boolean;
  data?: {
    order?: {
      payment_status?: PaymentStatus;
    };
  };
};

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 30;

export async function waitForOrderPaymentStatus(
  orderId: string,
  signal?: AbortSignal,
): Promise<PaymentStatus> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) {
      throw new Error("Payment confirmation cancelled.");
    }

    const response = await fetch(`/api/orders/${orderId}`, {
      cache: "no-store",
      signal,
    });
    const data = (await response.json().catch(() => ({}))) as OrderStatusResponse;

    if (!response.ok || !data.success) {
      throw new Error("Could not verify payment status.");
    }

    const status = data.data?.order?.payment_status;

    if (status === "paid") return "paid";
    if (status === "failed") {
      throw new Error("Payment failed. Please try again.");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(
    "Payment is still processing. If amount was deducted, contact support with your order reference.",
  );
}
