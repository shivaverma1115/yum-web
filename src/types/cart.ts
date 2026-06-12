import { IProduct } from "./product";

export interface ICartItem extends Pick<IProduct, "name" | "image_url" | "slug"> {
  productId: string;
  quantity: number;
  maxQuantity: number;
  price: number;
}
