import { IUser } from "./user";

export type FulfillmentType = "delivery" | "pickup" | "dine_in";

export type PaymentMethod = "cod" | "paypal" | "amazon" | "card";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type IOrderItem = {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
};

export type IOrder = {
  id?: string;
  user_id?: string | null;
  fulfillment_type: FulfillmentType;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  total: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address?: string | null;
  delivery_country?: string | null;
  delivery_state?: string | null;
  delivery_city?: string | null;
  delivery_zip_code?: string | null;
  pickup_time?: string | null;
  table_number?: string | null;
  party_size?: string | null;
  additional_notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CheckoutPayload = Pick<IUser, 'first_name' | 'last_name' | 'email' | 'phone' | 'country' | 'state' | 'zip_code'> & {
  fulfillment_type: FulfillmentType;
  payment_method: PaymentMethod;
  address?: string;
  city?: string;
  pickup_time?: string;
  table_number?: string;
  party_size?: number;
  additional_notes?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string | null;
  }[];
};
