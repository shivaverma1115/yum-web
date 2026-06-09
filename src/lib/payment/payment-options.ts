import type { FulfillmentType, PaymentMethod } from "@/types/order";

export type PaymentOption = {
  value: PaymentMethod;
  label: string;
  icon: string;
};

export const PAYMENT_OPTIONS_BY_FULFILLMENT: Record<FulfillmentType, PaymentOption[]> = {
  delivery: [
    { value: "cash_on_delivery", label: "Cash on Delivery", icon: "banknote" },
    { value: "online", label: "Pay Online", icon: "credit-card" },
  ],
  pickup: [
    { value: "pay_at_counter", label: "Pay at Counter", icon: "store" },
    { value: "online", label: "Pay Online", icon: "credit-card" },
  ],
  dine_in: [
    { value: "pay_at_table", label: "Pay at Table", icon: "utensils" },
    { value: "online", label: "Pay Online", icon: "credit-card" },
  ],
};

export function getPaymentOptionsForFulfillment(
  fulfillment: FulfillmentType,
): PaymentOption[] {
  return PAYMENT_OPTIONS_BY_FULFILLMENT[fulfillment];
}

export function getDefaultPaymentMethod(fulfillment: FulfillmentType): PaymentMethod {
  return PAYMENT_OPTIONS_BY_FULFILLMENT[fulfillment][0].value;
}

export function isPaymentMethodAllowed(
  fulfillment: FulfillmentType,
  method: PaymentMethod,
): boolean {
  return PAYMENT_OPTIONS_BY_FULFILLMENT[fulfillment].some((o) => o.value === method);
}
