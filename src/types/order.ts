
export type FulfillmentType = "delivery" | "pickup" | "dine_in";

export type PaymentMethod =
  | "cash_on_delivery"
  | "pay_at_counter"
  | "pay_at_table"
  | "online";

export type PaymentStatus = "pending" | "paid" | "failed";

export type OnlinePaymentPhase = "pending" | "complete";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "cancelled"
  | "completed";

export type IOrderItem = {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
  created_at?: string;
};

export type IOrderWithItems = IOrder & {
  items: IOrderItem[];
};

export type IOrder = {
  id?: string;
  user_id: string;
  fulfillment_type: FulfillmentType;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status?: PaymentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  subtotal: number;
  total: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string | null;
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
