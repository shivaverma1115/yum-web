"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import ProductImageCarousel from "@/components/storefront/Products/ProductImageCarousel";
import ProductCustomizeModal from "@/components/storefront/Products/ProductCustomizeModal";
import { useCart } from "@/context-api/cart-context";
import { formatCurrency } from "@/lib/constants";
import {
  getCartPriceBreakdown,
  getDefaultVariant,
} from "@/lib/cart/line";
import {
  FOOD_TAG_OPTIONS,
  getDietTypeLabel,
  getOptionLabel,
} from "@/lib/products/attributes";
import type { IProduct } from "@/types/product";

type ProductCardProps = {
  product: IProduct;
  /** Resolved category display name. Falls back to a humanized slug. */
  categoryName?: string;
};

function isVegDiet(dietType: IProduct["diet_type"]) {
  return (
    dietType === "veg" || dietType === "jain" || dietType === "vegan"
  );
}

function DietTypeBadge({ dietType }: { dietType: NonNullable<IProduct["diet_type"]> }) {
  const label = getDietTypeLabel(dietType);
  const veg = isVegDiet(dietType);

  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={label}
      aria-label={label}
    >
      <Image
        src={veg ? "/images/icons/veg.svg" : "/images/icons/non-veg.svg"}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 shrink-0"
        aria-hidden
      />
      <span
        className={`text-xs font-semibold ${
          veg
            ? "text-green-700"
            : dietType === "egg"
              ? "text-amber-700"
              : "text-red-700"
        }`}
      >
        {label}
      </span>
    </span>
  );
}

function getDisplayPricing(product: IProduct) {
  return getCartPriceBreakdown(product, {
    variant: getDefaultVariant(product),
    customizations: [],
  });
}

function PriceDisplay({
  unitPrice,
  compareAtPrice,
}: {
  unitPrice: number;
  compareAtPrice: number | null;
}) {
  if (compareAtPrice != null) {
    return (
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="text-base font-semibold text-default-800">
          {formatCurrency(unitPrice)}
        </span>
        <span className="text-sm text-default-400 line-through">
          {formatCurrency(compareAtPrice)}
        </span>
      </div>
    );
  }

  return (
    <p className="text-base font-semibold text-default-800">
      {formatCurrency(unitPrice)}
    </p>
  );
}

const addButtonClassName =
  "relative z-10 inline-flex min-w-[5.5rem] items-center justify-center rounded-lg border border-default-200 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary/5";

export default function ProductCard({ product }: ProductCardProps) {
  const { items } = useCart();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const variants = product.variants ?? [];
  const needsCustomizeModal = variants.length > 1;
  const hasDiscount =
    Boolean(product.add_discount) &&
    product.discount_percent != null &&
    product.discount_percent > 0;

  const highlightTag = product.food_tag ?? null;

  const displayPricing = useMemo(() => getDisplayPricing(product), [product]);

  const productCartQuantity = useMemo(
    () =>
      product.id
        ? items
            .filter((item) => item.productId === product.id)
            .reduce((sum, item) => sum + item.quantity, 0)
        : 0,
    [items, product.id],
  );

  const simpleOptions = useMemo(
    () => ({
      variant: getDefaultVariant(product),
      customizations: [],
    }),
    [product],
  );

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-default-200 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-default-50">
        <div className="relative overflow-hidden">
          <ProductImageCarousel
            product={product}
            variant="card"
          />

          {product.diet_type ? (
            <span
              className="absolute left-3 top-3 z-10 rounded-md bg-white/95 p-1 shadow-sm"
              title={getDietTypeLabel(product.diet_type)}
              aria-label={getDietTypeLabel(product.diet_type)}
            >
              <Image
                src={
                  isVegDiet(product.diet_type)
                    ? "/images/icons/veg.svg"
                    : "/images/icons/non-veg.svg"
                }
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
                aria-hidden
              />
            </span>
          ) : null}

          {hasDiscount ? (
            <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              {product.discount_percent}% off
            </span>
          ) : null}

          {product.is_available === false ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-default-800">
                Unavailable
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-3.5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {product.diet_type ? (
                <DietTypeBadge dietType={product.diet_type} />
              ) : null}

              {highlightTag ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                  {getOptionLabel(FOOD_TAG_OPTIONS, highlightTag)}
                </span>
              ) : null}
            </div>
          </div>

          <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-snug text-default-900">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div>
              <PriceDisplay
                unitPrice={displayPricing.unitPrice}
                compareAtPrice={displayPricing.compareAtPrice}
              />
              {productCartQuantity > 0 ? (
                <p className="text-xs text-default-500">
                  {productCartQuantity} in cart
                </p>
              ) : null}
            </div>

            {productCartQuantity === 0 ? (
              needsCustomizeModal ? (
                <button
                  type="button"
                  disabled={product.is_available === false}
                  onClick={() => setCustomizeOpen(true)}
                  className={`${addButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Add
                </button>
              ) : (
                <div className="min-w-[5.5rem]">
                  <AddToCartButton
                    product={product}
                    options={simpleOptions}
                    className={addButtonClassName}
                  >
                    Add
                  </AddToCartButton>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {needsCustomizeModal ? (
        <ProductCustomizeModal
          open={customizeOpen}
          product={product}
          onClose={() => setCustomizeOpen(false)}
        />
      ) : null}
    </>
  );
}
