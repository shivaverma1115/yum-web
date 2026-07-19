import type {
  CartCustomizationSelection,
  CartVariantSelection,
} from "@/lib/cart/line";
import type { FulfillmentType } from "@/types/order";
import type { IProduct } from "@/types/product";

export interface ICartItem extends Pick<IProduct, "name" | "image_url" | "slug"> {
  /** Unique per product + variant + add-ons combination. */
  lineId: string;
  productId: string;
  quantity: number;
  maxQuantity: number;
  /** Final unit price including variant + add-ons (and discount on base). */
  price: number;
  /** Fulfillment types this product supports (from product.order_type). */
  order_type: FulfillmentType[];
  variant: CartVariantSelection | null;
  customizations: CartCustomizationSelection[];
}
