import type { FulfillmentType } from "@/types/order";

export type IProduct = {
  id?: string;
  user_id: string;
  name: string;
  category: string;
  selling_price: number | null;
  cost_price: number | null;
  quantity: number | null;
  order_type: FulfillmentType[];
  short_description: string;
  long_description: string;
  add_discount: boolean;
  discount_percent: number | null;
  add_expiry_date: boolean;
  expiry_start_date: string | null;
  expiry_end_date: string | null;
  return_policy: boolean;
  image_url: string | null;
  image_urls: string[];
  created_at?: string;
  updated_at?: string;
};

export type ProductFormInput = Omit<
  IProduct,
  "id" | "user_id" | "created_at" | "updated_at"
>;
