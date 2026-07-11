import type { ReactNode } from "react";
import { Clock, Flame, Leaf } from "lucide-react";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import { AppTooltip } from "@/components/common/AppTooltip";
import { formatCurrency } from "@/lib/constants";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import {
  ALLERGEN_OPTIONS,
  FOOD_TAG_OPTIONS,
  formatSlugLabel,
  getDietTypeLabel,
  getNutritionOption,
  getOptionLabel,
  hasProductNutrition,
  INGREDIENT_OPTIONS,
  SPICE_LEVEL_OPTIONS,
} from "@/lib/products/attributes";
import { isRichTextEmpty, richTextToPlainText } from "@/lib/rich-text";
import type { IProduct } from "@/types/product";

type ProductCardProps = {
  product: IProduct;
  /** Resolved category display name. Falls back to a humanized slug. */
  categoryName?: string;
};

function useProductDisplay(product: IProduct, categoryName?: string) {
  const hasDiscount =
    product.add_discount &&
    product.discount_percent != null &&
    product.selling_price != null;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.selling_price, product.discount_percent)
    : null;
  const resolvedCategoryName =
    categoryName?.trim() ||
    (product.category ? formatSlugLabel(product.category) : "");
  const excerpt = !isRichTextEmpty(product.short_description)
    ? richTextToPlainText(product.short_description, 120)
    : resolvedCategoryName;

  return {
    imageSrc: product.image_url ?? "",
    hasDiscount,
    discountedPrice,
    categoryLabel: resolvedCategoryName,
    excerpt,
  };
}

function Chip({
  children,
  className = "bg-default-100 text-default-700",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${className}`}
    >
      {children}
    </span>
  );
}

function ProductImageBadges({
  product,
  hasDiscount,
  categoryLabel,
}: {
  product: IProduct;
  hasDiscount: boolean;
  categoryLabel: string;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        {product.diet_type ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
              product.diet_type === "veg" ||
              product.diet_type === "jain" ||
              product.diet_type === "vegan"
                ? "bg-green-600 text-white"
                : product.diet_type === "egg"
                  ? "bg-amber-600 text-white"
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

    </>
  );
}

function ProductPrice({
  hasDiscount,
  discountedPrice,
  sellingPrice,
}: {
  hasDiscount: boolean;
  discountedPrice: number | null;
  sellingPrice: number | null;
}) {
  if (hasDiscount && discountedPrice != null) {
    return (
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-xl font-bold text-primary">
          {formatCurrency(discountedPrice)}
        </span>
        <span className="text-sm text-default-400 line-through">
          {formatCurrency(sellingPrice!)}
        </span>
      </div>
    );
  }

  return (
    <span className="text-xl font-bold text-default-900">
      {sellingPrice !== null ? formatCurrency(sellingPrice) : "—"}
    </span>
  );
}

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  const { imageSrc, hasDiscount, discountedPrice, categoryLabel, excerpt } =
    useProductDisplay(product, categoryName);

  const foodTags = product.food_tags ?? [];
  const spiceLevels = product.spice_levels ?? [];
  const variants = product.variants ?? [];
  const customizations = product.customizations ?? [];
  const ingredients = product.ingredients ?? [];
  const allergens = product.allergens ?? [];
  const nutrition = product.nutrition ?? [];
  const showNutrition = hasProductNutrition(nutrition);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-default-200 bg-white shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg dark:bg-default-50">
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <ProductImageBadges
          product={product}
          hasDiscount={hasDiscount}
          categoryLabel={categoryLabel}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-default-900">
            {product.name}
          </h3>
        </div>

        {excerpt ? (
          <p className="mb-3 line-clamp-2 text-sm text-default-500">{excerpt}</p>
        ) : null}

        {foodTags.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {foodTags.slice(0, 2).map((tag) => (
              <Chip
                key={tag}
                className="bg-primary/10 text-primary"
              >
                {getOptionLabel(FOOD_TAG_OPTIONS, tag)}
              </Chip>
            ))}
            {foodTags.length > 2 ? (
              <AppTooltip
                side="top"
                align="start"
                contentClassName="max-w-xs"
                content={
                  <ul className="space-y-1.5 text-left">
                    {foodTags.slice(2).map((tag) => (
                      <li key={tag} className="text-sm text-white">
                        {getOptionLabel(FOOD_TAG_OPTIONS, tag)}
                      </li>
                    ))}
                  </ul>
                }
              >
                <button
                  type="button"
                  className="relative z-10 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary transition-colors hover:bg-primary/20"
                  aria-label={`Show ${foodTags.length - 2} more tags`}
                >
                  +{foodTags.length - 2} more
                </button>
              </AppTooltip>
            ) : null}
          </div>
        ) : null}

        <div className="mb-3 flex flex-wrap gap-2">
          {product.preparation_time_minutes != null ? (
            <Chip>
              <Clock className="h-3.5 w-3.5 shrink-0 text-default-500" aria-hidden />
              {product.preparation_time_minutes} min
            </Chip>
          ) : null}
          {spiceLevels.map((level) => (
            <Chip
              key={level}
              className="bg-orange-500/10 text-orange-700 dark:text-orange-400"
            >
              <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {getOptionLabel(SPICE_LEVEL_OPTIONS, level)}
            </Chip>
          ))}
          <Chip
            className={
              product.is_available === false
                ? "bg-red-500/10 text-red-700 dark:text-red-400"
                : "bg-green-500/10 text-green-700 dark:text-green-400"
            }
          >
            {product.is_available === false ? "Unavailable" : "Available"}
          </Chip>
        </div>

        {variants.length > 0 ? (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-default-500">
              Variants
            </p>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((variant) => (
                <Chip key={`${variant.name}-${variant.price}`}>
                  {variant.name}: {formatCurrency(variant.price)}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        {customizations.length > 0 ? (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-default-500">
              Add-ons
            </p>
            <div className="flex flex-wrap gap-1.5">
              {customizations.map((item) => (
                <Chip key={`${item.label}-${item.extra_price}`}>
                  {item.label}
                  {item.extra_price > 0
                    ? ` (+${formatCurrency(item.extra_price)})`
                    : ""}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        {showNutrition ? (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-default-500">
              Nutrition
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {nutrition.map((item) => {
                const option = getNutritionOption(item.key);
                return (
                  <div
                    key={item.key}
                    className="rounded-lg bg-default-50 px-2 py-1.5 dark:bg-default-100/40"
                  >
                    <p className="text-[11px] text-default-500">
                      {option?.label ?? formatSlugLabel(item.key)}
                    </p>
                    <p className="text-xs font-medium text-default-800">
                      {item.value}
                      {option?.unit ? ` ${option.unit}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {ingredients.length > 0 ? (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-default-500">
              Ingredients
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.slice(0, 2).map((ingredient) => (
                <Chip key={ingredient}>
                  {getOptionLabel(INGREDIENT_OPTIONS, ingredient)}
                </Chip>
              ))}
              {ingredients.length > 2 ? (
                <AppTooltip
                  side="top"
                  align="start"
                  contentClassName="max-w-xs"
                  content={
                    <ul className="space-y-1.5 text-left">
                      {ingredients.slice(2).map((ingredient) => (
                        <li key={ingredient} className="text-sm text-white">
                          {getOptionLabel(INGREDIENT_OPTIONS, ingredient)}
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <button
                    type="button"
                    className="relative z-10 inline-flex items-center gap-1 rounded-full bg-default-200 px-2.5 py-1 text-xs text-default-700 transition-colors hover:bg-default-300"
                    aria-label={`Show ${ingredients.length - 2} more ingredients`}
                  >
                    +{ingredients.length - 2} more
                  </button>
                </AppTooltip>
              ) : null}
            </div>
          </div>
        ) : null}

        {allergens.length > 0 ? (
          <div className="mb-4">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-default-500">
              Allergens
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allergens.map((allergen) => (
                <Chip
                  key={allergen}
                  className="bg-red-500/10 text-red-700 dark:text-red-400"
                >
                  {getOptionLabel(ALLERGEN_OPTIONS, allergen)}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

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
