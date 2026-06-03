import type { IUser } from "@/types/user";
import { COUNTRIES, STATES } from "@/lib/constants";
import { getDefaultPaymentMethod } from "@/lib/checkout/payment-options";
import type { CheckoutPayload, FulfillmentType } from "@/types/order";

export type CheckoutFormValues = Omit<CheckoutPayload, 'items'>

export function buildCheckoutDefaults(user: IUser | null): CheckoutFormValues {
  let firstName = user?.first_name?.trim() ?? "";
  let lastName = user?.last_name?.trim() ?? "";

  const fullName = user?.full_name?.trim();
  if ((!firstName || !lastName) && fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    firstName = firstName || parts[0] || "";
    lastName = lastName || parts.slice(1).join(" ") || firstName;
  }

  return {
    fulfillment_type: "delivery",
    first_name: firstName,
    last_name: lastName,
    email: user?.email?.trim() ?? "",
    phone: user?.phone?.trim() ?? "",
    address: "",
    country: user?.country?.trim() || COUNTRIES[0],
    state: user?.state?.trim() || STATES[0],
    city: "",
    zip_code: user?.zip_code?.trim() ?? "",
    pickup_time: "",
    table_number: "",
    party_size: 0,
    payment_method: getDefaultPaymentMethod("delivery"),
    additional_notes: user?.description?.trim() ?? "",
  };
}

export const FULFILLMENT_OPTIONS: {
  value: FulfillmentType;
  label: string;
  description: string;
}[] = [
  {
    value: "delivery",
    label: "Delivery",
    description: "We deliver to your address.",
  },
  {
    value: "pickup",
    label: "Pickup",
    description: "Pick up your order at the restaurant.",
  },
  {
    value: "dine_in",
    label: "Dine In / On Table",
    description: "Enjoy your meal at your table.",
  },
];
