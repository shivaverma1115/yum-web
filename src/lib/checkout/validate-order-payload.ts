// import { enrichCheckoutContact } from "@/lib/checkout/guest-contact";
// import { isPaymentMethodAllowed } from "@/lib/payment/payment-options";
// import { validatePhoneValue } from "@/lib/phone-otp/phone";
// import type { CheckoutPayload, FulfillmentType, PaymentMethod } from "@/types/order";

// export function isFulfillmentType(value: unknown): value is FulfillmentType {
//   return value === "delivery" || value === "pickup" || value === "dine_in";
// }

// export function isPaymentMethod(value: unknown): value is PaymentMethod {
//   return (
//     value === "cash_on_delivery" ||
//     value === "pay_at_counter" ||
//     value === "pay_at_table" ||
//     value === "online"
//   );
// }

// export function validateCheckoutPayload(
//   payload: Partial<CheckoutPayload>,
// ): { valid: true; data: CheckoutPayload } | { valid: false; message: string; errors?: Record<string, string> } {
//   if (!isFulfillmentType(payload.fulfillment_type)) {
//     return { valid: false, message: "Invalid fulfillment type.", errors: { fulfillment_type: "Required." } };
//   }

//   if (!isPaymentMethod(payload.payment_method)) {
//     return { valid: false, message: "Invalid payment method.", errors: { payment_method: "Required." } };
//   }

//   if (!isPaymentMethodAllowed(payload.fulfillment_type, payload.payment_method)) {
//     return {
//       valid: false,
//       message: "Payment method is not available for this fulfillment type.",
//       errors: { payment_method: "Choose a valid option." },
//     };
//   }

//   const fulfillment = payload.fulfillment_type;
//   const errors: Record<string, string> = {};

//   if (fulfillment === "delivery" || fulfillment === "pickup") {
//     const phoneResult = validatePhoneValue(payload.phone);
//     if (phoneResult !== true) {
//       errors.phone = phoneResult;
//     }
//   }

//   if (fulfillment === "delivery") {
//     if (!payload.address?.trim()) {
//       errors.address = "Street address is required for delivery.";
//     }
//   }

//   if (fulfillment === "dine_in" && !payload.table_number?.trim()) {
//     errors.table_number = "Table number is required.";
//   }

//   if (Object.keys(errors).length > 0) {
//     return {
//       valid: false,
//       message: "Please fix the validation errors.",
//       errors,
//     };
//   }

//   if (!payload.items?.length) {
//     return {
//       valid: false,
//       message: "Your cart is empty.",
//       errors: { items: "Add at least one product." },
//     };
//   }

//   if (payload.payment_method === "online") {
//     const phase = payload.payment_phase ?? "complete";
//     const orderId = payload.razorpay_order_id?.trim();

//     if (phase === "pending") {
//       if (!orderId) {
//         return {
//           valid: false,
//           message: "Razorpay order id is required.",
//           errors: { razorpay_order_id: "Missing Razorpay order." },
//         };
//       }
//     } else {
//       const paymentId = payload.razorpay_payment_id?.trim();
//       const signature = payload.razorpay_signature?.trim();

//       if (!orderId || !paymentId || !signature) {
//         return {
//           valid: false,
//           message: "Complete online payment before placing the order.",
//           errors: { payment_method: "Payment verification is required." },
//         };
//       }
//     }
//   }

//   const enriched = enrichCheckoutContact(payload as CheckoutPayload);
//   return { valid: true, data: enriched };
// }
