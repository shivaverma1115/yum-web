"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context-api/cart-context";
import type { IProduct } from "@/types/product";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type AddToCartButtonProps = {
  product: IProduct;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  redirectToCart?: boolean;
};

const quantityControlClassName =
  "inline-flex min-w-0 flex-1 items-center justify-between gap-2 rounded-full border border-default-200 p-1";

function CartNavButton({ itemCount }: { itemCount: number }) {
  if (itemCount <= 0) return null;

  return (
    <Link
      href="/cart"
      aria-label={`View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      className="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full border border-primary bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-500"
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      <span>View cart</span>
      <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </Link>
  );
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  children = "Add to cart",
  redirectToCart = false,
}: AddToCartButtonProps) {
  const { items, addItem, setItemQuantity, itemCount } = useCart();
  const router = useRouter();

  const cartItem = product.id
    ? items.find((item) => item.productId === product.id)
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

    addItem(product, quantity);
    // toast.success(`${product.name} added to cart.`);

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
      <div className="relative z-10 flex w-full items-center gap-2">
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
        <CartNavButton itemCount={itemCount} />
      </div>
    );
  }

  return (
    <button type="button" onClick={handleAdd} className={className}>
      {children}
    </button>
  );
}
