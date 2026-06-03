import { IProduct } from "./product";

export interface ICartItem extends Pick<IProduct, 'id' | 'name' | 'image_url'> {
  productId: string;
  quantity: number;
  maxQuantity: number;
  price: number;
}
