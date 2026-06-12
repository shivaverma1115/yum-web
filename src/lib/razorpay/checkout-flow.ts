import {
  confirmOrderPayment,
  createRazorpayPaymentOrder,
} from "@/lib/razorpay/api-client";
import { openRazorpayCheckout } from "@/lib/razorpay/checkout-browser";
import {
  RAZORPAY_CHECKOUT_DESCRIPTION,
  RAZORPAY_CHECKOUT_NAME,
} from "@/lib/razorpay/constants";
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

export async function runCheckoutOnlinePayment(
  input: RunCheckoutOnlinePaymentInput,
): Promise<OnlinePaymentFlowResult> {
  const razorpayOrder = await createRazorpayPaymentOrder(input.subtotal);
  const pending = await input.createPendingOrder(razorpayOrder.orderId);

  try {
    const payment = await openRazorpayCheckout({
      keyId: razorpayOrder.keyId,
      orderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: RAZORPAY_CHECKOUT_NAME,
      description: RAZORPAY_CHECKOUT_DESCRIPTION,
      prefill: input.prefill,
    });

    await confirmOrderPayment(pending.orderId, payment);

    return {
      status: "success",
      orderId: pending.orderId,
      redirectTo: pending.redirectTo,
    };
  } catch (error) {
    const outcome = await resolveRazorpayCheckoutError(pending.orderId, error);

    if (outcome.status === "cancelled" || outcome.status === "failed") {
      return {
        ...outcome,
        redirectTo: pending.redirectTo ?? "/user/orders",
      };
    }

    return outcome;
  }
}
