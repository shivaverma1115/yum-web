import { buildPaymentProcessingUrl } from "@/lib/razorpay/processing-url";
import {
  isRazorpayPaymentCancelledError,
  isRazorpayPaymentFailedError,
} from "@/lib/razorpay/errors";
import type { OnlinePaymentFlowResult } from "@/lib/razorpay/types";

export async function resolveRazorpayCheckoutError(
  orderId: string,
  error: unknown,
): Promise<OnlinePaymentFlowResult | null> {
  if (
    isRazorpayPaymentCancelledError(error) ||
    isRazorpayPaymentFailedError(error)
  ) {
    return {
      status: "processing",
      orderId,
      redirectTo: buildPaymentProcessingUrl(orderId),
    };
  }

  return null;
}
