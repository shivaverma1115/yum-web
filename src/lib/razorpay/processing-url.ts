export function buildPaymentProcessingUrl(orderId: string): string {
  return `/checkout/processing?orderId=${encodeURIComponent(orderId)}`;
}
