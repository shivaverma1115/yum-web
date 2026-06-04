"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context-api/cart-context";
import type { IProduct } from "@/types/product";

type AddToCartButtonProps = {
  product: IProduct;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  redirectToCart?: boolean;
};

const quantityControlClassName =
  "relative z-10 inline-flex items-center justify-between gap-2 rounded-full border border-default-200 p-1";

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  children = "Add to cart",
  redirectToCart = false,
}: AddToCartButtonProps) {
  const { items, addItem, setItemQuantity } = useCart();
  const router = useRouter();

  const cartItem = product.id
    ? items.find((item) => item.productId === product.id)
    : undefined;

  const handleAdd = () => {
    if (!product.id) {
      toast.error("This product cannot be added to the cart.");
      return;
    }

    if (product.quantity !== undefined && product.quantity <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    addItem(product, quantity);
    toast.success(`${product.name} added to cart.`);

    if (redirectToCart) {
      router.push("/cart");
    }
  };

  const handleDecrease = () => {
    if (!product.id || !cartItem) return;
    setItemQuantity(product.id, cartItem.quantity - 1);
  };

  const handleIncrease = () => {
    if (!product.id || !cartItem) return;

    if (cartItem.quantity >= cartItem.maxQuantity) {
      toast.error("Maximum available quantity reached.");
      return;
    }

    setItemQuantity(product.id, cartItem.quantity + 1);
  };

  if (cartItem) {
    const atMax = cartItem.quantity >= cartItem.maxQuantity;

    return (
      <div className={quantityControlClassName}>
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={handleDecrease}
          className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center disabled:opacity-50"
          >
          –
        </button>
        <span className="min-w-[2rem] text-center text-sm font-medium text-default-800">
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
    );
  }

  return (
    <button type="button" onClick={handleAdd} className={className}>
      {children}
    </button>
  );
}
