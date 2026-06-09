const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

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

export type RazorpayCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export class RazorpayPaymentFailedError extends Error {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  constructor(
    message: string,
    meta?: { razorpayOrderId?: string; razorpayPaymentId?: string },
  ) {
    super(message);
    this.name = "RazorpayPaymentFailedError";
    this.razorpayOrderId = meta?.razorpayOrderId;
    this.razorpayPaymentId = meta?.razorpayPaymentId;
  }
}

/** Razorpay handler payloads vary slightly; normalize before sending to the API. */
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

export type OpenRazorpayCheckoutParams = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email?: string;
    contact: string;
  };
};

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
      theme: { color: "#ea580c" },
      handler: (response: Record<string, unknown>) =>
        resolve(normalizeRazorpayHandlerResponse(response)),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
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
