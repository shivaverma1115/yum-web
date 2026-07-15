"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Leaf, X } from "lucide-react";
import { toast } from "react-toastify";
import { MAX_CART_LINE_QUANTITY, useCart } from "@/context-api/cart-context";
import { formatCurrency } from "@/lib/constants";
import {
  getCartPriceBreakdown,
  getDefaultVariant,
  type CartCustomizationSelection,
  type CartVariantSelection,
} from "@/lib/cart/line";
import { getDietTypeLabel } from "@/lib/products/attributes";
import type { IProduct } from "@/types/product";
import { useRouter } from "next/navigation";
import ProductImageCarousel from "@/components/storefront/Products/ProductImageCarousel";

type ProductCustomizeModalProps = {
  open: boolean;
  product: IProduct;
  onClose: () => void;
};

function isVegDiet(dietType: IProduct["diet_type"]) {
  return (
    dietType === "veg" || dietType === "jain" || dietType === "vegan"
  );
}

function PricePair({
  unitPrice,
  compareAtPrice,
  className = "text-sm text-default-700",
  compareClassName = "text-xs text-default-400 line-through",
}: {
  unitPrice: number;
  compareAtPrice: number | null;
  className?: string;
  compareClassName?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={className}>{formatCurrency(unitPrice)}</span>
      {compareAtPrice != null ? (
        <span className={compareClassName}>
          {formatCurrency(compareAtPrice)}
        </span>
      ) : null}
    </span>
  );
}

export default function ProductCustomizeModal({
  open,
  product,
  onClose,
}: ProductCustomizeModalProps) {
  const titleId = useId();
  const { addItem } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const variants = product.variants ?? [];
  const availableCustomizations = product.customizations ?? [];

  const [selectedVariant, setSelectedVariant] =
    useState<CartVariantSelection | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    CartCustomizationSelection[]
  >([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    setSelectedVariant(getDefaultVariant(product));
    setSelectedCustomizations([]);
    setQuantity(1);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, product, onClose]);

  const options = useMemo(
    () => ({
      variant: selectedVariant,
      customizations: selectedCustomizations,
    }),
    [selectedVariant, selectedCustomizations],
  );

  const pricing = useMemo(
    () => getCartPriceBreakdown(product, options),
    [product, options],
  );

  const lineTotal = Math.round(pricing.unitPrice * quantity * 100) / 100;
  const compareLineTotal =
    pricing.compareAtPrice != null
      ? Math.round(pricing.compareAtPrice * quantity * 100) / 100
      : null;

  const toggleCustomization = (item: CartCustomizationSelection) => {
    setSelectedCustomizations((current) => {
      const exists = current.some((entry) => entry.label === item.label);
      if (exists) {
        return current.filter((entry) => entry.label !== item.label);
      }
      return [...current, item];
    });
  };

  const handleAdd = () => {
    if (!product.id) {
      toast.error("This product cannot be added to the cart.");
      return;
    }

    if (product.is_available === false) {
      toast.error("This product is currently unavailable.");
      return;
    }

    if (variants.length > 1 && !selectedVariant) {
      toast.error("Please select a size.");
      return;
    }

    addItem(product, quantity, options);
    onClose();
    router.push("/cart");
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Close customize dialog"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl dark:bg-default-50 sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-default-900 text-white shadow-md sm:-top-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-default-200 px-4 py-4">
          <ProductImageCarousel
            product={product}
            variant="thumb"
            showPagination={false}
          />
          <div className="min-w-0">
            <h3
              id={titleId}
              className="truncate text-base font-semibold text-default-900"
            >
              {product.name}
            </h3>
            {product.diet_type ? (
              <p className="mt-0.5 text-xs text-default-500">
                {getDietTypeLabel(product.diet_type)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          <div className="rounded-xl bg-primary/10 px-3 py-2.5 text-sm text-default-700">
            Choose a size and add-ons to customize your order.
          </div>

          {variants.length > 0 ? (
            <section>
              <h4 className="text-base font-semibold text-default-900">
                Quantity
              </h4>
              <p className="mb-3 text-sm text-default-500">Select any 1</p>
              <div className="overflow-hidden rounded-xl border border-default-200">
                {variants.map((variant, index) => {
                  const selected = selectedVariant?.name === variant.name;
                  const optionPricing = getCartPriceBreakdown(product, {
                    variant: { name: variant.name, price: variant.price },
                    customizations: [],
                  });

                  return (
                    <label
                      key={`${variant.name}-${variant.price}`}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-3 ${
                        index > 0 ? "border-t border-default-200" : ""
                      }`}
                    >
                      {product.diet_type ? (
                        <span
                          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                            isVegDiet(product.diet_type)
                              ? "border-green-600 text-green-600"
                              : "border-red-600 text-red-600"
                          }`}
                          aria-hidden
                        >
                          <Leaf className="h-3 w-3" />
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1 text-sm font-medium text-default-800">
                        {variant.name}
                      </span>
                      <PricePair
                        unitPrice={optionPricing.unitPrice}
                        compareAtPrice={optionPricing.compareAtPrice}
                      />
                      <input
                        type="radio"
                        name={`${titleId}-variant`}
                        checked={selected}
                        onChange={() =>
                          setSelectedVariant({
                            name: variant.name,
                            price: variant.price,
                          })
                        }
                        className="h-4 w-4 border-default-300 text-primary focus:ring-primary"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          ) : null}

          {availableCustomizations.length > 0 ? (
            <section>
              <h4 className="text-base font-semibold text-default-900">
                Add-ons
              </h4>
              <p className="mb-3 text-sm text-default-500">
                Select as many as you like
              </p>
              <div className="overflow-hidden rounded-xl border border-default-200">
                {availableCustomizations.map((item, index) => {
                  const selected = selectedCustomizations.some(
                    (entry) => entry.label === item.label,
                  );

                  return (
                    <label
                      key={`${item.label}-${item.extra_price}`}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-3 ${
                        index > 0 ? "border-t border-default-200" : ""
                      }`}
                    >
                      <span className="min-w-0 flex-1 text-sm font-medium text-default-800">
                        {item.label}
                      </span>
                      <span className="text-sm text-default-700">
                        {item.extra_price > 0
                          ? `+${formatCurrency(item.extra_price)}`
                          : "Free"}
                      </span>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleCustomization({
                            label: item.label,
                            extra_price: item.extra_price,
                          })
                        }
                        className="h-4 w-4 rounded border-default-300 text-primary focus:ring-primary"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        <div className="flex items-center gap-3 border-t border-default-200 px-4 py-3">
          <div className="inline-flex items-center gap-3 rounded-lg border border-default-200 px-2 py-1.5">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-lg font-semibold text-primary disabled:opacity-40"
            >
              –
            </button>
            <span className="min-w-6 text-center text-sm font-semibold text-default-900">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= MAX_CART_LINE_QUANTITY}
              onClick={() =>
                setQuantity((value) =>
                  Math.min(MAX_CART_LINE_QUANTITY, value + 1),
                )
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-lg font-semibold text-primary disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={product.is_available === false}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
          >
            <span>Add Item</span>
            <span aria-hidden>|</span>
            <span className="inline-flex items-baseline gap-1.5">
              <span>{formatCurrency(lineTotal)}</span>
              {compareLineTotal != null ? (
                <span className="text-xs font-medium text-white/70 line-through">
                  {formatCurrency(compareLineTotal)}
                </span>
              ) : null}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
