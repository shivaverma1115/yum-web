import { retryOrderPaymentSession } from "@/lib/razorpay/api-client";
import { openRazorpayCheckout } from "@/lib/razorpay/checkout-browser";
import {
  RAZORPAY_CHECKOUT_DESCRIPTION,
  RAZORPAY_CHECKOUT_NAME,
} from "@/lib/razorpay/constants";
import { buildPaymentProcessingUrl } from "@/lib/razorpay/processing-url";
import { resolveRazorpayCheckoutError } from "@/lib/razorpay/payment-outcome";
import type {
  OnlinePaymentFlowResult,
  RazorpayCheckoutPrefill,
} from "@/lib/razorpay/types";

export type RetryOrderPaymentInput = {
  orderId: string;
  prefill: RazorpayCheckoutPrefill;
};

export async function runRetryOrderPayment(
  input: RetryOrderPaymentInput,
): Promise<OnlinePaymentFlowResult> {
  const razorpayOrder = await retryOrderPaymentSession(input.orderId);

  try {
    await openRazorpayCheckout({
      keyId: razorpayOrder.keyId,
      orderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: RAZORPAY_CHECKOUT_NAME,
      description: RAZORPAY_CHECKOUT_DESCRIPTION,
      prefill: input.prefill,
    });

    return {
      status: "processing",
      orderId: input.orderId,
      redirectTo: buildPaymentProcessingUrl(input.orderId),
    };
  } catch (error) {
    const outcome = await resolveRazorpayCheckoutError(input.orderId, error);
    if (outcome) {
      return outcome;
    }

    throw error;
  }
}
