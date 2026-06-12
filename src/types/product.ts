import type { FulfillmentType } from "@/types/order";
import type {
  ProductAllergen,
  ProductDietType,
  ProductIngredient,
  SpiceLevel,
} from "@/lib/products/attributes";

export type IProduct = {
  id?: string;
  user_id: string;
  slug: string;
  name: string;
  category: string;
  selling_price: number | null;
  quantity: number | null;
  order_type: FulfillmentType[];
  short_description: string;
  long_description: string;
  add_discount: boolean;
  discount_percent: number | null;
  preparation_time_minutes: number | null;
  diet_type: ProductDietType | null;
  spice_levels: SpiceLevel[];
  ingredients: ProductIngredient[];
  allergens: ProductAllergen[];
  is_available: boolean;
  image_url: string | null;
  image_urls: string[];
  created_at?: string;
  updated_at?: string;
};

export type ProductFormInput = Omit<
  IProduct,
  "id" | "user_id" | "slug" | "created_at" | "updated_at"
>;
