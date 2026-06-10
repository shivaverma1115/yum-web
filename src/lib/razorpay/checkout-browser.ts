"use client";

import {
  RAZORPAY_SCRIPT_URL,
  RAZORPAY_THEME_COLOR,
} from "@/lib/razorpay/constants";
import {
  RazorpayPaymentCancelledError,
  RazorpayPaymentFailedError,
} from "@/lib/razorpay/errors";
import type {
  OpenRazorpayCheckoutParams,
  RazorpayCheckoutResponse,
} from "@/lib/razorpay/types";

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayCheckoutScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay is only available in the browser."));
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${RAZORPAY_SCRIPT_URL}"]`,
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load Razorpay checkout.")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
}

export function normalizeRazorpayHandlerResponse(
  response: Record<string, unknown>,
): RazorpayCheckoutResponse {
  return {
    razorpay_order_id: String(
      response.razorpay_order_id ?? response.order_id ?? "",
    ).trim(),
    razorpay_payment_id: String(
      response.razorpay_payment_id ?? response.payment_id ?? "",
    ).trim(),
    razorpay_signature: String(
      response.razorpay_signature ?? response.signature ?? "",
    ).trim(),
  };
}

export async function openRazorpayCheckout(
  params: OpenRazorpayCheckoutParams,
): Promise<RazorpayCheckoutResponse> {
  await loadRazorpayCheckoutScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable.");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: params.keyId,
      amount: params.amount,
      currency: params.currency,
      name: params.name,
      description: params.description,
      order_id: params.orderId,
      prefill: params.prefill,
      theme: { color: RAZORPAY_THEME_COLOR },
      handler: (response: Record<string, unknown>) =>
        resolve(normalizeRazorpayHandlerResponse(response)),
      modal: {
        ondismiss: () => reject(new RazorpayPaymentCancelledError()),
      },
    });

    rzp.on(
      "payment.failed",
      (response: {
        error?: {
          description?: string;
          metadata?: { order_id?: string; payment_id?: string };
        };
      }) => {
        const metadata = response.error?.metadata;
        reject(
          new RazorpayPaymentFailedError(
            response.error?.description ?? "Payment failed. Please try again.",
            {
              razorpayOrderId: metadata?.order_id,
              razorpayPaymentId: metadata?.payment_id,
            },
          ),
        );
      },
    );

    rzp.open();
  });
}
