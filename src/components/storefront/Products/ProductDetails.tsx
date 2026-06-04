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
} from "@/lib/api/products";
import { formatCurrency } from "@/lib/constants";
import type { IProduct } from "@/types/product";

interface ProductDetailsProps {
    /** Route param: product UUID (folder is named [slug]). */
    slug: string;
}

export default function ProductDetails({ slug: productId }: ProductDetailsProps) {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [related, setRelated] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!productId) {
            setError("Invalid product.");
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        let active = true;

        async function load() {
            setIsLoading(true);
            setError(null);

            try {
                const loaded = await fetchProduct(productId, controller.signal);
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
    }, [productId]);

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

    const description =
        product.long_description?.trim() ||
        product.short_description?.trim() ||
        "No description available.";

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
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <h3 className="text-4xl font-medium text-default-800 mb-1">
                                {product.name}
                            </h3>
                            <h5 className="text-lg font-medium text-default-600 mb-2">
                                <span className="text-base font-normal text-default-500">
                                    Category:
                                </span>{" "}
                                {product.category}
                            </h5>

                            <p className="text-sm text-default-500 mb-4">{description}</p>

                            <div className="flex flex-wrap gap-2 mb-5">
                                {product.order_type ? (
                                    <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                        <span className="text-xs">{product.order_type}</span>
                                    </div>
                                ) : null}
                                <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                    <span className="text-xs">{product.category}</span>
                                </div>
                                {product.add_discount ? (
                                    <div className="border border-primary/30 bg-primary/10 rounded-full px-3 py-1.5 flex items-center">
                                        <span className="text-xs text-primary">Discount</span>
                                    </div>
                                ) : null}
                                {product.return_policy ? (
                                    <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                        <span className="text-xs">Return policy</span>
                                    </div>
                                ) : null}
                            </div>

                            <h4 className="text-3xl font-semibold text-primary mb-6">
                                {formatCurrency(product.selling_price)}
                                {product.add_discount ? (
                                    <span className="ms-2 text-lg text-default-400 font-medium line-through">
                                        {formatCurrency(product.cost_price)}
                                    </span>
                                ) : null}
                            </h4>

                            <p className="text-sm text-default-600 mb-6">
                                {product.quantity > 0
                                    ? `${product.quantity} in stock`
                                    : "Out of stock"}
                            </p>

                            <div className="flex items-center gap-2 mb-8">
                                <div className="relative z-10 inline-flex justify-between border border-default-200 p-1 rounded-full">
                                    <button
                                        type="button"
                                        className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-9 w-9 text-sm inline-flex items-center justify-center"
                                        onClick={() =>
                                            setQuantity((q) => Math.max(1, q - 1))
                                        }
                                    >
                                        –
                                    </button>
                                    <input
                                        type="text"
                                        readOnly
                                        value={quantity}
                                        className="w-12 border-0 text-sm text-center focus:ring-0 p-0 bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-9 w-9 text-sm inline-flex items-center justify-center"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.min(product.quantity || 99, q + 1),
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <AddToCartButton
                                    product={product}
                                    quantity={quantity}
                                    redirectToCart
                                    className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
                                >
                                    Buy Now
                                </AddToCartButton>

                                <i
                                    data-lucide="heart"
                                    className="h-8 w-8 text-default-400 cursor-pointer hover:fill-red-600 hover:text-red-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {related.length > 0 ? (
                <section className="lg:py-10 py-6">
                    <div className="container">
                        <h4 className="text-xl font-semibold text-default-800 mb-4">
                            You may also like
                        </h4>
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
