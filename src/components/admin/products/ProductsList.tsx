"use client";

import Link from "next/link";
import type { IProduct } from "@/types/product";
import { useEffect, useState, type MouseEvent } from "react";
import { toast } from "react-toastify";
import { productPath } from "@/lib/products/slug";
import { fetchProductsPage } from "@/lib/products/products";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import OrderTypeBadges from "@/components/common/OrderTypeBadges";
import { TableSkeleton } from "@/components/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  ImageIcon,
  Pencil,
  Trash,
} from "lucide-react";
import {
  FOOD_TAG_OPTIONS,
  getDietTypeLabel,
  getOptionLabel,
} from "@/lib/products/attributes";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import { getProductBasePrice } from "@/lib/cart/line";
import { richTextToPlainText } from "@/lib/rich-text";
import Badge from "@/components/ui/Badge";
import { AppTooltip } from "@/components/common/AppTooltip";
import { cn } from "@/lib/utils/helpers";

const TABLE_COL_SPAN = 9;
const DEFAULT_LIMIT = 10;
const DESCRIPTION_PREVIEW_LENGTH = 80;

function getProductGalleryUrls(product: IProduct): string[] {
  const urls = [...(product.image_urls ?? [])].filter(Boolean);
  if (product.image_url && !urls.includes(product.image_url)) {
    urls.unshift(product.image_url);
  }
  return urls;
}

function ProductImageFrame({
  productName,
  images,
}: {
  productName: string;
  images: string[];
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const activeIndex = count === 0 ? 0 : index % count;
  const activeSrc = images[activeIndex];

  useEffect(() => {
    setIndex(0);
  }, [images.join("|")]);

  if (count === 0) {
    return (
      <div
        className="flex size-24 items-center justify-center rounded-xl border border-dashed border-default-200 bg-default-50 text-default-400"
        aria-label={`No image for ${productName}`}
      >
        <ImageIcon className="size-7" aria-hidden />
      </div>
    );
  }

  const goPrev = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIndex((current) => (current - 1 + count) % count);
  };

  const goNext = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIndex((current) => (current + 1) % count);
  };

  return (
    <div className="group relative size-40 shrink-0 overflow-hidden rounded-xl border border-default-200 bg-default-50 shadow-sm">
      <img
        src={activeSrc}
        alt={`${productName}${count > 1 ? ` (${activeIndex + 1} of ${count})` : ""}`}
        className="size-full object-cover transition-opacity duration-200"
      />

      {count > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <button
            type="button"
            onClick={goPrev}
            className="absolute start-1 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/75 group-hover:opacity-100"
            aria-label={`Previous image for ${productName}`}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute end-1 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/75 group-hover:opacity-100"
            aria-label={`Next image for ${productName}`}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>

          <div className="absolute inset-x-0 bottom-1.5 z-10 flex items-center justify-center gap-1">
            {images.map((src, dotIndex) => (
              <button
                key={`${src}-${dotIndex}`}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIndex(dotIndex);
                }}
                className={cn(
                  "size-2 rounded-full transition-all",
                  dotIndex === activeIndex
                    ? "scale-110 bg-white"
                    : "bg-white/50 hover:bg-white/80",
                )}
                aria-label={`Show image ${dotIndex + 1} of ${count}`}
                aria-current={dotIndex === activeIndex}
              />
            ))}
          </div>

          <span className="absolute end-1.5 top-1.5 z-10 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white tabular-nums">
            {activeIndex + 1}/{count}
          </span>
        </>
      ) : null}
    </div>
  );
}

function dietBadgeColor(dietType: IProduct["diet_type"]) {
  if (dietType === "veg" || dietType === "jain" || dietType === "vegan") {
    return "green" as const;
  }
  if (dietType === "egg") {
    return "amber" as const;
  }
  if (dietType === "non_veg") {
    return "red" as const;
  }
  return "default" as const;
}

function ProductPriceCell({ product }: { product: IProduct }) {
  const basePrice = getProductBasePrice(product);
  const hasDiscount =
    product.add_discount &&
    product.discount_percent != null &&
    basePrice != null;
  const discounted = hasDiscount
    ? calculateDiscountedPrice(basePrice, product.discount_percent)
    : null;

  if (basePrice == null) {
    return <span className="text-default-400">—</span>;
  }

  if (hasDiscount && discounted != null) {
    return (
      <div className="space-y-0.5">
        <p className="font-semibold text-default-900">
          {formatCurrency(discounted)}
        </p>
        <p className="text-xs text-default-400 line-through">
          {formatCurrency(basePrice)}
        </p>
        <Badge color="primary" size="sm">
          {product.discount_percent}% off
        </Badge>
      </div>
    );
  }

  return (
    <p className="font-semibold text-default-900">
      {formatCurrency(basePrice)}
    </p>
  );
}

function ProductDescriptionTooltip({ product }: { product: IProduct }) {
  const shortFull = richTextToPlainText(product.short_description);
  const longFull = richTextToPlainText(product.long_description);
  const excerpt = richTextToPlainText(
    product.short_description,
    DESCRIPTION_PREVIEW_LENGTH,
  );

  if (!excerpt && !longFull) {
    return <span className="text-xs text-default-400">No description</span>;
  }

  const preview = excerpt || richTextToPlainText(product.long_description, DESCRIPTION_PREVIEW_LENGTH);
  const hasMore =
    shortFull.length > DESCRIPTION_PREVIEW_LENGTH ||
    longFull.length > 0;

  const tooltipContent = (
    <div className="space-y-2.5 text-left">
      {shortFull ? (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
            Short description
          </p>
          <p className="text-sm font-normal leading-relaxed text-white">
            {shortFull}
          </p>
        </div>
      ) : null}
      {longFull ? (
        <div className={shortFull ? "border-t border-white/15 pt-2.5" : undefined}>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
            Full description
          </p>
          <p className="max-h-40 overflow-y-auto text-sm font-normal leading-relaxed text-white/95">
            {longFull}
          </p>
        </div>
      ) : null}
    </div>
  );

  if (!hasMore) {
    return (
      <p className="text-xs leading-relaxed text-default-500">{preview}</p>
    );
  }

  return (
    <AppTooltip
      content={tooltipContent}
      side="top"
      align="start"
      contentClassName="md:max-w-sm md:px-3.5 md:py-3"
    >
      <button
        type="button"
        className="group max-w-full text-start"
        aria-label={`View full description for ${product.name}`}
      >
        <p className="text-xs leading-relaxed text-default-500 underline decoration-default-300 decoration-dotted underline-offset-2 transition-colors group-hover:text-default-700 group-hover:decoration-default-500">
          {preview}
        </p>
        <span className="mt-1 block text-[10px] font-medium text-primary md:hidden">
          Tap to read more
        </span>
      </button>
    </AppTooltip>
  );
}

const metaChipClassName =
  "inline-flex items-center gap-1 rounded-full bg-default-100 px-2 py-0.5 text-[11px] font-medium text-default-600 underline decoration-default-300 decoration-dotted underline-offset-2 transition-colors hover:bg-default-200 hover:text-default-800";

function ProductVariantsTooltip({
  productName,
  variants,
}: {
  productName: string;
  variants: IProduct["variants"];
}) {
  if (!variants.length) return null;

  return (
    <AppTooltip
      side="top"
      align="start"
      contentClassName="md:min-w-[200px] md:px-3.5 md:py-3"
      content={
        <ul className="space-y-2 text-left">
          {variants.map((variant, index) => (
            <li
              key={`${variant.name}-${index}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="font-medium text-white">{variant.name}</span>
              <span className="shrink-0 text-white/80">
                {formatCurrency(variant.price)}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <button
        type="button"
        className={metaChipClassName}
        aria-label={`View ${variants.length} variants for ${productName}`}
      >
        {variants.length} variant{variants.length === 1 ? "" : "s"}
      </button>
    </AppTooltip>
  );
}

function ProductCustomizationsTooltip({
  productName,
  customizations,
}: {
  productName: string;
  customizations: IProduct["customizations"];
}) {
  if (!customizations.length) return null;

  return (
    <AppTooltip
      side="top"
      align="start"
      contentClassName="md:min-w-[200px] md:px-3.5 md:py-3"
      content={
        <ul className="space-y-2 text-left">
          {customizations.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="font-medium text-white">{item.label}</span>
              <span className="shrink-0 text-white/80">
                {item.extra_price > 0
                  ? `+${formatCurrency(item.extra_price)}`
                  : "Free"}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <button
        type="button"
        className={metaChipClassName}
        aria-label={`View ${customizations.length} add-ons for ${productName}`}
      >
        {customizations.length} add-on
        {customizations.length === 1 ? "" : "s"}
      </button>
    </AppTooltip>
  );
}

function ProductPrepTimeTooltip({
  productName,
  minutes,
}: {
  productName: string;
  minutes: number;
}) {
  return (
    <AppTooltip
      side="top"
      align="start"
      contentClassName="md:max-w-[220px] md:px-3.5 md:py-3"
      content={
        <p className="text-sm leading-relaxed text-white">
          Estimated kitchen prep time for <span className="font-semibold">{productName}</span> is{" "}
          <span className="font-semibold">{minutes} minute{minutes === 1 ? "" : "s"}</span>.
        </p>
      }
    >
      <button
        type="button"
        className={metaChipClassName}
        aria-label={`Preparation time for ${productName}: ${minutes} minutes`}
      >
        <Clock className="size-3" aria-hidden />
        {minutes} min
      </button>
    </AppTooltip>
  );
}

function ProductMetaCell({ product }: { product: IProduct }) {
  const tag = product.food_tag;
  const variants = product.variants ?? [];
  const customizations = product.customizations ?? [];

  return (
    <div className="min-w-[220px] max-w-[280px] space-y-2">
      <ProductDescriptionTooltip product={product} />

      {tag ? (
        <div className="flex flex-wrap gap-1">
          <span className="rounded-full bg-default-100 px-2 py-0.5 text-[11px] font-medium text-default-700">
            {getOptionLabel(FOOD_TAG_OPTIONS, tag)}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <ProductVariantsTooltip
          productName={product.name}
          variants={variants}
        />
        <ProductCustomizationsTooltip
          productName={product.name}
          customizations={customizations}
        />
        {product.preparation_time_minutes != null ? (
          <ProductPrepTimeTooltip
            productName={product.name}
            minutes={product.preparation_time_minutes}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function ProductsList() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const handleDelete = async (product: IProduct) => {
    if (!product.id) return;

    const confirmed = window.confirm(
      `Delete product "${product.name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Failed to delete product.");
        return;
      }

      toast.success(data.message ?? "Product deleted.");

      if (products.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setReloadToken((current) => current + 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const data = await fetchProductsPage({
          page,
          limit: DEFAULT_LIMIT,
          signal: controller.signal,
          endpoint: "/api/admin/products",
        });

        if (!active) return;

        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to load products.",
        );
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, reloadToken]);

  const startItem = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const endItem = Math.min(page * DEFAULT_LIMIT, total);

  return (
    <div className="grid grid-cols-1">
      <div className="overflow-hidden rounded-xl border border-default-200 bg-white dark:bg-default-50">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-default-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-default-900">Products</h2>
            <p className="mt-1 text-sm text-default-500">
              Manage menu items, pricing, availability, and store visibility.
            </p>
          </div>
          <Link
            href="/admin/products/add"
            className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-500"
          >
            Add Product
          </Link>
        </div>

        <div className="relative overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={TABLE_COL_SPAN} rows={DEFAULT_LIMIT} className="p-2" />
          ) : (
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Type
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Order types
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Details
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-default-500">
                    Updated
                  </th>
                  <th className="px-5 py-3.5 text-end text-xs font-semibold uppercase tracking-wide text-default-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-default-100">
                {products.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-12 text-center text-sm text-default-500"
                      colSpan={TABLE_COL_SPAN}
                    >
                      No products found. Add your first menu item to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const gallery = getProductGalleryUrls(product);

                    return (
                      <tr
                        key={product.id}
                        className="align-top transition-colors hover:bg-default-50/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-[240px] items-start gap-3">
                            <ProductImageFrame
                              productName={product.name}
                              images={gallery}
                            />
                            <div className="min-w-0 space-y-1">
                              <p className="truncate text-sm font-semibold text-default-900">
                                {product.name}
                              </p>
                              <p className="truncate text-xs text-default-400">
                                {product.slug || product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="rounded-md bg-default-100 px-2.5 py-1 text-xs font-medium text-default-700">
                            {product.category || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {product.diet_type ? (
                            <Badge color={dietBadgeColor(product.diet_type)} size="sm">
                              {getDietTypeLabel(product.diet_type)}
                            </Badge>
                          ) : (
                            <span className="text-sm text-default-400">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <ProductPriceCell product={product} />
                        </td>

                        <td className="px-5 py-4">
                          <OrderTypeBadges
                            types={product.order_type}
                            className="min-w-[140px]"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <ProductMetaCell product={product} />
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge
                            color={product.is_available === false ? "red" : "green"}
                            size="sm"
                          >
                            {product.is_available === false
                              ? "Unavailable"
                              : "Available"}
                          </Badge>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm text-default-700">
                            {formatCustomerSince(product.updated_at)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-default-400">
                            Created {formatCustomerSince(product.created_at)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            <Link
                              href={productPath(product)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-default-600 transition-colors hover:bg-default-100"
                              title="Open on storefront"
                            >
                              <ExternalLink className="size-3.5" aria-hidden />
                              Store
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                            >
                              <Eye className="size-3.5" aria-hidden />
                              View
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-default-700 transition-colors hover:bg-default-100"
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Edit
                            </Link>
                            <button
                              type="button"
                              disabled={deletingId === product.id}
                              onClick={() => void handleDelete(product)}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <Trash className="size-3.5" aria-hidden />
                              {deletingId === product.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-default-200 px-6 py-4">
            <p className="text-sm text-default-500">
              Showing {startItem}–{endItem} of {total} products
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-md bg-default-100 px-4 py-2 text-sm font-medium text-default-700 hover:bg-default-200 disabled:pointer-events-none disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-default-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-md bg-default-100 px-4 py-2 text-sm font-medium text-default-700 hover:bg-default-200 disabled:pointer-events-none disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
