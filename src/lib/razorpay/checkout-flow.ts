import { createRazorpayPaymentOrder } from "@/lib/razorpay/api-client";
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

export type CreatePendingOrderResult = {
  orderId: string;
  redirectTo?: string;
};

export type RunCheckoutOnlinePaymentInput = {
  subtotal: number;
  prefill: RazorpayCheckoutPrefill;
  createPendingOrder: (
    razorpayOrderId: string,
  ) => Promise<CreatePendingOrderResult>;
};

function toProcessingResult(orderId: string): OnlinePaymentFlowResult {
  return {
    status: "processing",
    orderId,
    redirectTo: buildPaymentProcessingUrl(orderId),
  };
}

export async function runCheckoutOnlinePayment(
  input: RunCheckoutOnlinePaymentInput,
): Promise<OnlinePaymentFlowResult> {
  const razorpayOrder = await createRazorpayPaymentOrder(input.subtotal);
  const pending = await input.createPendingOrder(razorpayOrder.orderId);

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

    return toProcessingResult(pending.orderId);
  } catch (error) {
    const outcome = await resolveRazorpayCheckoutError(pending.orderId, error);
    if (outcome) {
      return outcome;
    }

    throw error;
  }
}
