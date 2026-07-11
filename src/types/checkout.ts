import type { IUser } from "@/types/user";
import type {
  FulfillmentType,
  OnlinePaymentPhase,
  PaymentMethod,
} from "@/types/order";

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
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string | null;
  }[];
};

export type CheckoutFormValues = Omit<CheckoutPayload, "items">;
