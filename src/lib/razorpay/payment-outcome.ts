import { markOrderPaymentFailed } from "@/lib/razorpay/api-client";
import {
  isRazorpayPaymentCancelledError,
  isRazorpayPaymentFailedError,
} from "@/lib/razorpay/errors";
import type { OnlinePaymentFlowResult } from "@/lib/razorpay/types";

export async function resolveRazorpayCheckoutError(
  orderId: string,
  error: unknown,
): Promise<OnlinePaymentFlowResult> {
  if (isRazorpayPaymentCancelledError(error)) {
    return { status: "cancelled", orderId };
  }

  if (isRazorpayPaymentFailedError(error)) {
    await markOrderPaymentFailed(orderId, error.razorpayPaymentId);
    return {
      status: "failed",
      orderId,
      message: error.message,
    };
  }

  throw error;
}
