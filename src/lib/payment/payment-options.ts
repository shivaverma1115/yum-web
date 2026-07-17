import {
  Banknote,
  CreditCard,
  Store,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { FULFILLMENT_TYPE } from "@/lib/constants";
import type { FulfillmentType, PaymentMethod } from "@/types/order";

export type PaymentOption = {
  value: PaymentMethod;
  label: string;
  Icon: LucideIcon;
};

export const PAYMENT_OPTIONS_BY_FULFILLMENT: Record<FulfillmentType, PaymentOption[]> = {
  [FULFILLMENT_TYPE.DELIVERY]: [
    { value: "cash_on_delivery", label: "Cash on Delivery", Icon: Banknote },
    { value: "online", label: "Pay Online", Icon: CreditCard },
  ],
  [FULFILLMENT_TYPE.PICKUP]: [
    { value: "pay_at_counter", label: "Pay at Counter", Icon: Store },
    { value: "online", label: "Pay Online", Icon: CreditCard },
  ],
  [FULFILLMENT_TYPE.DINE_IN]: [
    { value: "pay_at_table", label: "Pay at Table", Icon: Utensils },
    { value: "online", label: "Pay Online", Icon: CreditCard },
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
