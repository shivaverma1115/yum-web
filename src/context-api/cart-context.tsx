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
import {
  buildCartLineId,
  calculateCartUnitPrice,
  normalizeCustomizations,
  type CartItemOptions,
} from "@/lib/cart/line";
import { computeCouponDiscountAmount } from "@/lib/coupons/discount";
import { getProductImages } from "@/lib/products/products";
import {
  loadCartFromStorage,
  loadCouponFromStorage,
  saveCartToStorage,
  saveCouponToStorage,
} from "@/lib/cart/storage";
import {
  computeCartBillSummary,
  feeConfigFromBusinessSettings,
  type CartBillSummary,
} from "@/lib/cart/totals";
import type { AppliedCoupon } from "@/types/coupon";
import type { ICartItem } from "@/types/cart";
import type { IProduct } from "@/types/product";
import { useBusinessSettings } from "@/context-api/business-settings-context";
import { normalizeOrderTypes } from "@/lib/order-types";

type CartContextValue = {
  items: ICartItem[];
  itemCount: number;
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  couponDiscount: number;
  /** Shared bill totals — same amount on cart button, breakdown, and checkout. */
  bill: CartBillSummary;
  amountToPay: number;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  addItem: (
    product: IProduct,
    quantity?: number,
    options?: CartItemOptions,
  ) => void;
  removeItem: (lineId: string) => void;
  setItemQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Soft cap per cart line — restaurants don't track inventory stock. */
export const MAX_CART_LINE_QUANTITY = 20;

function productToCartItem(
  product: IProduct,
  quantity: number,
  options: CartItemOptions = {},
): ICartItem | null {
  if (!product.id) return null;
  if (product.is_available === false) return null;

  const images = getProductImages(product);
  const variant = options.variant ?? null;
  const customizations = normalizeCustomizations(options.customizations);
  const lineId = buildCartLineId(product.id, variant?.name, customizations);

  return {
    lineId,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image_url: images[0] ?? "/images/dishes/pizza.png",
    price: calculateCartUnitPrice(product, { variant, customizations }),
    quantity: Math.min(Math.max(1, quantity), MAX_CART_LINE_QUANTITY),
    maxQuantity: MAX_CART_LINE_QUANTITY,
    order_type: normalizeOrderTypes(product.order_type),
    variant,
    customizations,
  };
}

function mergeItems(existing: ICartItem[], incoming: ICartItem): ICartItem[] {
  const index = existing.findIndex((item) => item.lineId === incoming.lineId);

  if (index === -1) {
    return [...existing, incoming];
  }

  const current = existing[index];
  const nextQty = Math.min(
    current.maxQuantity,
    current.quantity + incoming.quantity,
  );

  return existing.map((item, i) =>
    i === index
      ? {
          ...item,
          quantity: nextQty,
          order_type:
            incoming.order_type.length > 0
              ? incoming.order_type
              : item.order_type,
        }
      : item,
  );
}

function normalizeStoredCartItems(items: ICartItem[]): ICartItem[] {
  const normalized: ICartItem[] = [];

  for (const item of items) {
    if (!item?.productId || !item.name) continue;

    const customizations = normalizeCustomizations(item.customizations);
    const variant = item.variant?.name
      ? {
          name: item.variant.name,
          price: Number(item.variant.price) || 0,
        }
      : null;
    const lineId =
      item.lineId ||
      buildCartLineId(item.productId, variant?.name, customizations);

    normalized.push({
      lineId,
      productId: item.productId,
      slug: item.slug ?? "",
      name: item.name,
      image_url: item.image_url ?? "/images/dishes/pizza.png",
      price: Number(item.price) || 0,
      quantity: Math.min(
        Math.max(1, Number(item.quantity) || 1),
        MAX_CART_LINE_QUANTITY,
      ),
      maxQuantity: MAX_CART_LINE_QUANTITY,
      order_type: normalizeOrderTypes(item.order_type),
      variant,
      customizations,
    });
  }

  return normalized;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { settings } = useBusinessSettings();
  const [items, setItems] = useState<ICartItem[]>([]);
  const [appliedCoupon, setAppliedCouponState] =
    useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(normalizeStoredCartItems(loadCartFromStorage()));
    setAppliedCouponState(loadCouponFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCartToStorage(items);
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveCouponToStorage(appliedCoupon);
  }, [appliedCoupon, hydrated]);

  const setAppliedCoupon = useCallback((coupon: AppliedCoupon | null) => {
    setAppliedCouponState(coupon);
  }, []);

  const addItem = useCallback(
    (product: IProduct, quantity = 1, options: CartItemOptions = {}) => {
      const incoming = productToCartItem(product, quantity, options);
      if (!incoming) return;
      setItems((prev) => mergeItems(prev, incoming));
    },
    [],
  );

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const setItemQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.lineId !== lineId) return item;
          if (quantity <= 0) return null;
          return {
            ...item,
            quantity: Math.min(item.maxQuantity, Math.max(1, quantity)),
          };
        })
        .filter((item): item is ICartItem => item !== null),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCouponState(null);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.min_order_amount) return 0;
    return computeCouponDiscountAmount(appliedCoupon, subtotal);
  }, [appliedCoupon, subtotal]);

  const feeConfig = useMemo(
    () => feeConfigFromBusinessSettings(settings),
    [settings],
  );

  const bill = useMemo(
    () =>
      computeCartBillSummary({
        items,
        subtotal,
        couponDiscount,
        couponCode: appliedCoupon?.code ?? null,
        fees: feeConfig,
      }),
    [items, subtotal, couponDiscount, appliedCoupon?.code, feeConfig],
  );

  useEffect(() => {
    if (!hydrated || !appliedCoupon) return;
    if (subtotal < appliedCoupon.min_order_amount || couponDiscount <= 0) {
      setAppliedCouponState(null);
    }
  }, [hydrated, appliedCoupon, subtotal, couponDiscount]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      appliedCoupon,
      couponDiscount,
      bill,
      amountToPay: bill.amountToPay,
      setAppliedCoupon,
      addItem,
      removeItem,
      setItemQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      appliedCoupon,
      couponDiscount,
      bill,
      setAppliedCoupon,
      addItem,
      removeItem,
      setItemQuantity,
      clearCart,
    ],
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
