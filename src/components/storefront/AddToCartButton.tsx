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

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  children = "Add to cart",
  redirectToCart = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleClick = () => {
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

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
