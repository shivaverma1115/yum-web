import type { IUser } from "@/types/user";
import type {
  FulfillmentType,
  OnlinePaymentPhase,
  PaymentMethod,
} from "@/types/order";

export type CheckoutLinePayload = {
  productId: string;
  quantity: number;
  /** Variant name to match against product.variants (server prices used). */
  variantName?: string | null;
  /** Customization labels to match against product.customizations. */
  customizationLabels?: string[];
  /** @deprecated Display-only; server ignores and loads product name. */
  name?: string;
  /** @deprecated Ignored; server recomputes unit price. */
  price?: number;
  /** @deprecated Ignored; server uses product image. */
  imageUrl?: string | null;
};

export type CheckoutPayload = Pick<IUser, "phone"> & {
  address: string;
  table_number: string;
  additional_notes: string;
  fulfillment_type: FulfillmentType;
  payment_method: PaymentMethod;
  payment_phase?: OnlinePaymentPhase;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  coupon_code?: string | null;
  items: CheckoutLinePayload[];
};

export type CheckoutFormValues = Omit<CheckoutPayload, "items">;

/** Body for creating a Razorpay order from a trusted server quote. */
export type RazorpayQuoteRequest = {
  fulfillment_type: FulfillmentType;
  coupon_code?: string | null;
  items: CheckoutLinePayload[];
};
