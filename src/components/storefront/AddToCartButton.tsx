"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context-api/cart-context";
import {
  isSameCartConfiguration,
  type CartItemOptions,
} from "@/lib/cart/line";
import type { IProduct } from "@/types/product";

type AddToCartButtonProps = {
  product: IProduct;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  redirectToCart?: boolean;
  options?: CartItemOptions;
};

const quantityControlClassName =
  "inline-flex w-full min-w-0 items-center justify-between gap-1 rounded-full border border-default-200 p-1";

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  children = "Add to cart",
  redirectToCart = false,
  options,
}: AddToCartButtonProps) {
  const { items, addItem, setItemQuantity } = useCart();
  const router = useRouter();

  const cartItem = product.id
    ? items.find((item) =>
        isSameCartConfiguration(item, product.id!, options),
      )
    : undefined;

  const handleAdd = () => {
    if (!product.id) {
      toast.error("This product cannot be added to the cart.");
      return;
    }

    if (product.is_available === false) {
      toast.error("This product is currently unavailable.");
      return;
    }

    addItem(product, quantity, options);

    if (redirectToCart) {
      router.push("/cart");
    }
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    setItemQuantity(cartItem.lineId, cartItem.quantity - 1);
  };

  const handleIncrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity >= cartItem.maxQuantity) {
      toast.error("Maximum available quantity reached.");
      return;
    }

    setItemQuantity(cartItem.lineId, cartItem.quantity + 1);
  };

  if (cartItem) {
    const atMax = cartItem.quantity >= cartItem.maxQuantity;

    return (
      <div className="relative z-10 w-full">
        <div className={quantityControlClassName}>
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={handleDecrease}
            className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center disabled:opacity-50"
          >
            –
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-medium text-default-800">
            {cartItem.quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={atMax}
            onClick={handleIncrease}
            className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={handleAdd} className={className}>
      {children}
    </button>
  );
}
