import Link from "next/link";
import { Clock, Flame, Heart, Leaf } from "lucide-react";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import OrderTypeBadges from "@/components/common/OrderTypeBadges";
import { formatCurrency } from "@/lib/constants";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import {
  getDietTypeLabel,
  getOptionLabel,
  SPICE_LEVEL_OPTIONS,
} from "@/lib/products/attributes";
import { isRichTextEmpty, richTextToPlainText } from "@/lib/rich-text";
import { productPath } from "@/lib/products/slug";
import type { IProduct } from "@/types/product";

type ProductCardProps = {
  product: IProduct;
  variant?: 'grid' | 'list';
};

function useProductDisplay(product: IProduct) {
  const hasDiscount =
    product.add_discount &&
    product.discount_percent != null &&
    product.selling_price != null;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.selling_price, product.discount_percent)
    : null;
  const primarySpice = product.spice_levels[0];
  const spiceLabel = primarySpice
    ? getOptionLabel(SPICE_LEVEL_OPTIONS, primarySpice)
    : null;
  const excerpt = !isRichTextEmpty(product.short_description)
    ? richTextToPlainText(product.short_description, 120)
    : product.category;

  return {
    imageSrc: product.image_url ?? "",
    hasDiscount,
    discountedPrice,
    spiceLabel,
    excerpt,
  };
}

function ProductImageBadges({
  product,
  hasDiscount,
}: {
  product: IProduct;
  hasDiscount: boolean;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        {product.diet_type ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
              product.diet_type === "veg"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <Leaf className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {getDietTypeLabel(product.diet_type)}
          </span>
        ) : (
          <span />
        )}

        {hasDiscount ? (
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {product.discount_percent}% off
          </span>
        ) : null}
      </div>

      {product.category ? (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {product.category}
        </span>
      ) : null}
    </>
  );
}

function ProductMetaChips({
  product,
  spiceLabel,
}: {
  product: IProduct;
  spiceLabel: string | null;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-default-600">
      {product.preparation_time_minutes != null ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-default-100 px-2.5 py-1">
          <Clock className="h-3.5 w-3.5 shrink-0 text-default-500" aria-hidden />
          {product.preparation_time_minutes} min
        </span>
      ) : null}
      {spiceLabel ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-orange-700 dark:text-orange-400">
          <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {spiceLabel}
          {product.spice_levels.length > 1
            ? ` +${product.spice_levels.length - 1}`
            : ""}
        </span>
      ) : null}
      {product.quantity != null && product.quantity <= 5 ? (
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-400">
          Only {product.quantity} left
        </span>
      ) : null}
    </div>
  );
}

function ProductPrice({
  hasDiscount,
  discountedPrice,
  sellingPrice,
  size = "md",
}: {
  hasDiscount: boolean;
  discountedPrice: number | null;
  sellingPrice: number | null;
  size?: "md" | "lg";
}) {
  const priceClass =
    size === "lg"
      ? "text-lg sm:text-2xl font-semibold text-primary"
      : "text-xl font-bold text-primary";
  const regularClass =
    size === "lg"
      ? "text-lg sm:text-2xl font-semibold text-default-900"
      : "text-xl font-bold text-default-900";

  if (hasDiscount && discountedPrice != null) {
    return (
      <div className="flex flex-wrap items-baseline gap-2">
        <span className={priceClass}>{formatCurrency(discountedPrice)}</span>
        <span className="text-sm text-default-400 line-through">
          {formatCurrency(sellingPrice!)}
        </span>
      </div>
    );
  }

  return (
    <span className={regularClass}>
      {sellingPrice !== null ? formatCurrency(sellingPrice) : "—"}
    </span>
  );
}

function ProductFavoriteButton() {
  return (
    <button
      type="button"
      className="relative z-10 shrink-0 rounded-full p-1 text-default-300 transition-colors hover:text-red-500"
      aria-label="Add to favourites"
    >
      <Heart className="h-5 w-5" aria-hidden />
    </button>
  );
}

export default function ProductCard({
  product,
  variant = "grid",
}: ProductCardProps) {
  const { imageSrc, hasDiscount, discountedPrice, spiceLabel, excerpt } =
    useProductDisplay(product);

  if (variant === "list") {
    return (
      <div className="group relative rounded-lg border border-default-200 p-4 transition-all duration-300 hover:border-primary dark:bg-default-50">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative shrink-0 overflow-hidden rounded-lg md:w-48">
            <img
              src={imageSrc}
              alt={product.name}
              className="min-h-[140px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:min-h-[160px]"
            />
            <ProductImageBadges product={product} hasDiscount={hasDiscount} />
          </div>

          <div className="flex min-w-0 grow flex-col">
            <div className="mb-2 flex items-start justify-between gap-3">
              <Link
                href={productPath(product)}
                className="line-clamp-1 text-xl font-semibold text-default-800 transition-colors hover:text-primary after:absolute after:inset-0 sm:text-2xl"
              >
                {product.name}
              </Link>
              <ProductFavoriteButton />
            </div>

            <p className="mb-3 line-clamp-2 max-w-2xl text-base text-default-600">
              {excerpt}
            </p>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <OrderTypeBadges types={product.order_type} />
            </div>

            <div className="mb-4">
              <ProductMetaChips product={product} spiceLabel={spiceLabel} />
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-4">
              <AddToCartButton
                product={product}
                className="relative z-10 inline-flex items-center justify-center rounded-full border border-primary bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
              />
              <ProductPrice
                hasDiscount={hasDiscount}
                discountedPrice={discountedPrice}
                sellingPrice={product.selling_price}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-default-200 bg-white shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg dark:bg-default-50">
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <ProductImageBadges product={product} hasDiscount={hasDiscount} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <Link
            href={productPath(product)}
            className="line-clamp-2 text-lg font-semibold leading-snug text-default-900 transition-colors hover:text-primary after:absolute after:inset-0"
          >
            {product.name}
          </Link>
          <ProductFavoriteButton />
        </div>

        <p className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm text-default-500">
          {excerpt}
        </p>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <OrderTypeBadges types={product.order_type} />
        </div>

        <div className="mb-4">
          <ProductMetaChips product={product} spiceLabel={spiceLabel} />
        </div>

        <div className="mt-auto space-y-3">
          <ProductPrice
            hasDiscount={hasDiscount}
            discountedPrice={discountedPrice}
            sellingPrice={product.selling_price}
          />

          <AddToCartButton
            product={product}
            className="relative z-10 inline-flex w-full items-center justify-center rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
