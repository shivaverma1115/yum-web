export class RazorpayPaymentCancelledError extends Error {
  constructor(message = "Payment cancelled.") {
    super(message);
    this.name = "RazorpayPaymentCancelledError";
  }
}

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

export function isRazorpayPaymentCancelledError(
  error: unknown,
): error is RazorpayPaymentCancelledError {
  return error instanceof RazorpayPaymentCancelledError;
}

export function isRazorpayPaymentFailedError(
  error: unknown,
): error is RazorpayPaymentFailedError {
  return error instanceof RazorpayPaymentFailedError;
}
