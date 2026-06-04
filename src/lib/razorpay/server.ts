import crypto from "crypto";
import Razorpay from "razorpay";

export function getRazorpayKeyId(): string {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  if (!keyId) {
    throw new Error("RAZORPAY_KEY_ID is not configured.");
  }
  return keyId;
}

function getRazorpayKeySecret(): string {
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }
  return keySecret;
}

export function getRazorpayCurrency(): string {
  return process.env.RAZORPAY_CURRENCY?.trim() || "INR";
}

export function toRazorpayAmount(subtotal: number): number {
  return Math.max(1, Math.round(subtotal * 100));
}

export function createRazorpayClient(): Razorpay {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });
}

export async function createRazorpayOrder(amount: number, receipt: string) {
  const client = createRazorpayClient();
  const currency = getRazorpayCurrency();

  return client.orders.create({
    amount: toRazorpayAmount(amount),
    currency,
    receipt,
  });
}

function getRazorpayWebhookSecret(): string {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
  }
  return secret;
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  webhookSignature: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", getRazorpayWebhookSecret())
    .update(rawBody)
    .digest("hex");

  if (expected.length !== webhookSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(webhookSignature),
  );
}

export function verifyRazorpayPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", getRazorpayKeySecret())
    .update(body)
    .digest("hex");

  if (expected.length !== razorpaySignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(razorpaySignature),
  );
}
