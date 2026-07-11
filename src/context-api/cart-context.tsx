"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductImages } from "@/lib/products/products";
import { loadCartFromStorage, saveCartToStorage } from "@/lib/cart/storage";
import type { ICartItem } from "@/types/cart";
import type { IProduct } from "@/types/product";

type CartContextValue = {
  items: ICartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: IProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Soft cap per cart line — restaurants don't track inventory stock. */
export const MAX_CART_LINE_QUANTITY = 20;

function productToCartItem(product: IProduct, quantity: number): ICartItem | null {
  if (!product.id) return null;
  if (product.is_available === false) return null;

  const images = getProductImages(product);

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image_url: images[0] ?? "/images/dishes/pizza.png",
    price: product.selling_price ?? 0,
    quantity: Math.min(Math.max(1, quantity), MAX_CART_LINE_QUANTITY),
    maxQuantity: MAX_CART_LINE_QUANTITY,
  };
}

function mergeItems(existing: ICartItem[], incoming: ICartItem): ICartItem[] {
  const index = existing.findIndex((i) => i.productId === incoming.productId);

  if (index === -1) {
    return [...existing, incoming];
  }

  const current = existing[index];
  const nextQty = Math.min(
    current.maxQuantity,
    current.quantity + incoming.quantity,
  );

  return existing.map((item, i) =>
    i === index ? { ...item, quantity: nextQty } : item,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCartToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: IProduct, quantity = 1) => {
    const incoming = productToCartItem(product, quantity);
    if (!incoming) return;
    setItems((prev) => mergeItems(prev, incoming));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setItemQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          if (quantity <= 0) return null;
          return {
            ...item,
            quantity: Math.min(item.maxQuantity, Math.max(1, quantity)),
          };
        })
        .filter((item): item is ICartItem => item !== null),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      setItemQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, removeItem, setItemQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
