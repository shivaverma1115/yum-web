"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import ProductCard from "@/components/storefront/Products/ProductCard";
import ProductReviewsSection from "@/components/storefront/Products/ProductReviewsSection";
import {
    fetchProduct,
    fetchProductsPage,
    getProductImages,
} from "@/lib/products/products";
import HtmlContent from "@/components/common/HtmlContent";
import OrderTypeBadges from "@/components/common/OrderTypeBadges";
import { isRichTextEmpty } from "@/lib/rich-text";
import { formatCurrency } from "@/lib/constants";
import {
    ALLERGEN_OPTIONS,
    getDietTypeLabel,
    getOptionLabel,
    INGREDIENT_OPTIONS,
    SPICE_LEVEL_OPTIONS,
} from "@/lib/products/attributes";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import type { IProduct } from "@/types/product";
import { HeartIcon } from "lucide-react";

interface ProductDetailsProps {
    /** Canonical product slug from the URL. */
    slug: string;
    initialProduct?: IProduct;
    initialRelated?: IProduct[];
}

export default function ProductDetails({
    slug,
    initialProduct,
    initialRelated = [],
}: ProductDetailsProps) {
    const [product, setProduct] = useState<IProduct | null>(initialProduct ?? null);
    const [related, setRelated] = useState<IProduct[]>(initialRelated);
    const [isLoading, setIsLoading] = useState(!initialProduct);
    const [error, setError] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (!slug) {
            setError("Invalid product.");
            setIsLoading(false);
            return;
        }

        if (
            initialProduct &&
            (initialProduct.slug === slug || initialProduct.id === slug)
        ) {
            setProduct(initialProduct);
            setRelated(initialRelated);
            setIsLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        let active = true;

        async function load() {
            setIsLoading(true);
            setError(null);

            try {
                const loaded = await fetchProduct(slug, controller.signal);
                if (!active) return;
                setProduct(loaded);
                setActiveImageIndex(0);

                const list = await fetchProductsPage({
                    page: 1,
                    limit: 8,
                    signal: controller.signal,
                });
                if (!active) return;

                setRelated(
                    list.products.filter((p) => p.id !== loaded.id).slice(0, 4),
                );
            } catch (err) {
                if (!active || controller.signal.aborted) return;
                const message =
                    err instanceof Error ? err.message : "Failed to load product.";
                setError(message);
                setProduct(null);
                toast.error(message);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        void load();

        return () => {
            active = false;
            controller.abort();
        };
    }, [slug, initialProduct, initialRelated]);

    const images = useMemo(
        () => (product ? getProductImages(product) : []),
        [product],
    );

    const activeImage = images[activeImageIndex] ?? images[0];

    if (isLoading) {
        return (
            <div className="py-20 text-center text-sm text-default-500">
                Loading product...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="py-20 text-center">
                <p className="text-sm text-default-600 mb-4">
                    {error ?? "Product not found."}
                </p>
                <Link
                    href="/products"
                    className="inline-flex rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
                >
                    Back to products
                </Link>
            </div>
        );
    }

    const longDescription = product.long_description?.trim() ?? "";
    const shortDescription = product.short_description?.trim() ?? "";
    const hasLongDescription = !isRichTextEmpty(longDescription);
    const hasShortDescription = !isRichTextEmpty(shortDescription);

    return (
        <div>
            <section className="lg:py-10 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="rounded-lg border border-default-200 p-4 flex items-center justify-center min-h-[320px]">
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="max-w-full max-h-[400px] object-contain mx-auto"
                                />
                            </div>

                            {images.length > 1 ? (
                                <div className="flex flex-wrap justify-center gap-2">
                                    {images.map((src, index) => (
                                        <button
                                            key={`${src}-${index}`}
                                            type="button"
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`cursor-pointer rounded overflow-hidden border-2 transition-all !w-24 !h-24 lg:!w-32 lg:!h-32 ${index === activeImageIndex
                                                ? "border-primary"
                                                : "border-transparent"
                                                }`}
                                        >
                                            <img
                                                src={src}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <h1 className="text-4xl font-medium text-default-800 mb-1">
                                {product.name}
                            </h1>
                            <p className="text-lg font-medium text-default-600 mb-2">
                                <span className="text-base font-normal text-default-500">
                                    Category:
                                </span>{" "}
                                {product.category}
                            </p>

                            {hasShortDescription ? (
                                <HtmlContent
                                    html={shortDescription}
                                    className="mb-3 text-sm text-default-500"
                                />
                            ) : null}
                            {hasLongDescription ? (
                                <HtmlContent
                                    html={longDescription}
                                    className="mb-4 text-sm text-default-500"
                                />
                            ) : !hasShortDescription ? (
                                <p className="mb-4 text-sm text-default-500">
                                    No description available.
                                </p>
                            ) : null}

                            <div className="flex flex-wrap gap-2 mb-5">
                                <OrderTypeBadges types={product.order_type} />
                                <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                    <span className="text-xs">{product.category}</span>
                                </div>
                                {product.add_discount ? (
                                    <div className="border border-primary/30 bg-primary/10 rounded-full px-3 py-1.5 flex items-center">
                                        <span className="text-xs text-primary">Discount</span>
                                    </div>
                                ) : null}
                                {product.preparation_time_minutes != null ? (
                                    <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                        <span className="text-xs">
                                            Prep {product.preparation_time_minutes} min
                                        </span>
                                    </div>
                                ) : null}
                                {product.diet_type ? (
                                    <div className="border border-green-500/30 bg-green-500/10 rounded-full px-3 py-1.5 flex items-center">
                                        <span className="text-xs text-green-700 dark:text-green-400">
                                            {getDietTypeLabel(product.diet_type)}
                                        </span>
                                    </div>
                                ) : null}
                                {product.spice_levels.map((level) => (
                                    <div
                                        key={level}
                                        className="border border-orange-500/30 bg-orange-500/10 rounded-full px-3 py-1.5 flex items-center"
                                    >
                                        <span className="text-xs text-orange-700 dark:text-orange-400">
                                            {getOptionLabel(SPICE_LEVEL_OPTIONS, level)}
                                        </span>
                                    </div>
                                ))}
                                {product.ingredients.map((ingredient) => (
                                    <div
                                        key={ingredient}
                                        className="border border-default-200 rounded-full px-3 py-1.5 flex items-center"
                                    >
                                        <span className="text-xs">
                                            {getOptionLabel(INGREDIENT_OPTIONS, ingredient)}
                                        </span>
                                    </div>
                                ))}
                                {product.allergens.map((allergen) => (
                                    <div
                                        key={allergen}
                                        className="border border-red-500/30 bg-red-500/10 rounded-full px-3 py-1.5 flex items-center"
                                    >
                                        <span className="text-xs text-red-700 dark:text-red-400">
                                            {getOptionLabel(ALLERGEN_OPTIONS, allergen)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-3xl font-semibold text-primary mb-6">
                                {product.add_discount &&
                                    product.discount_percent != null &&
                                    product.selling_price != null ? (
                                    <>
                                        {formatCurrency(
                                            calculateDiscountedPrice(
                                                product.selling_price,
                                                product.discount_percent,
                                            ) ?? product.selling_price,
                                        )}
                                        <span className="ms-2 text-lg font-medium text-default-400 line-through">
                                            {formatCurrency(product.selling_price)}
                                        </span>
                                    </>
                                ) : (
                                    formatCurrency(product.selling_price ?? 0)
                                )}
                            </p>

                            <p className="text-sm text-default-600 mb-6">
                                {product.quantity != null && product.quantity > 0
                                    ? `${product.quantity} in stock`
                                    : "Out of stock"}
                            </p>

                            <div className="flex items-center gap-2 mb-8">
                                <AddToCartButton
                                    product={product}
                                    className="relative z-10 inline-flex items-center justify-center rounded-full border border-primary bg-primary px-12 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
                                />
                                <HeartIcon className="size-5 text-default-400 cursor-pointer hover:fill-red-600 hover:text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {related.length > 0 ? (
                <section className="lg:py-10 py-6">
                    <div className="container">
                        <h2 className="text-xl font-semibold text-default-800 mb-4">
                            You may also like
                        </h2>
                        <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-5 mb-10">
                            {related.map((item) => (
                                <ProductCard key={item.id ?? item.name} product={item} />
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="lg:py-10 py-6">
                <div className="container">
                    <ProductReviewsSection />
                </div>
            </section>
        </div>
    );
}
