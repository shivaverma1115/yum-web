export type IProduct = {
  id?: string;
  user_id: string;
  name: string;
  category: string;
  selling_price: number;
  cost_price: number;
  quantity: number;
  order_type: string;
  short_description: string;
  long_description: string;
  add_discount: boolean;
  add_expiry_date: boolean;
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
