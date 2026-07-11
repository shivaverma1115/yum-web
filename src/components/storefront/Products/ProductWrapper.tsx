"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryFilterSkeleton, ProductGridSkeleton } from "@/components/skeleton";
import { useStorefrontCatalog } from "@/hooks/use-storefront-catalog";
import ProductCard from "./ProductCard";

const DEFAULT_LIMIT = 10;

export default function ProductWrapper() {
    const {
        products,
        categories,
        categoriesLoading,
        selectedCategorySlugs,
        page,
        setPage,
        total,
        totalPages,
        isLoading,
        isAllCategoriesSelected,
        categoryNameBySlug,
        handleAllCategoriesChange,
        handleCategoryChange,
        limit,
    } = useStorefrontCatalog({ limit: DEFAULT_LIMIT });

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        if (!isMobileFilterOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileFilterOpen]);

    useEffect(() => {
        let cancelled = false;

        async function initPreline() {
            try {
                const { HSStaticMethods } = await import("preline/preline");
                if (cancelled) return;
                HSStaticMethods.autoInit();
            } catch (error) {
                console.error("Preline init failed:", error);
            }
        }

        void initPreline();

        return () => {
            cancelled = true;
        };
    }, []);

    const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
        <section className="lg:py-8 py-6">
            <div className="container">
                <div className="lg:flex gap-6">
                    {isMobileFilterOpen ? (
                        <button
                            type="button"
                            className="fixed inset-0 z-50 bg-default-900/50 lg:hidden"
                            aria-label="Close filter panel"
                            onClick={() => setIsMobileFilterOpen(false)}
                        />
                    ) : null}

                    <div
                        className={`max-w-xs lg:max-w-full lg:w-1/4 w-full fixed top-0 start-0 transition-all transform h-full z-60 lg:z-auto bg-white dark:bg-default-50 lg:translate-x-0 lg:block lg:static lg:start-auto ${isMobileFilterOpen
                            ? "translate-x-0 block"
                            : "-translate-x-full hidden lg:block"
                            }`}
                        id="filter_Offcanvas"
                        tabIndex={-1}
                    >
                        <div className="flex justify-between items-center py-3 px-4 border-b border-default-200 lg:hidden">
                            <h3 className="font-medium text-default-800">
                                Filter Options
                            </h3>

                            <button
                                className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-default-500 hover:text-default-700 text-sm"
                                type="button"
                                aria-label="Close filter panel"
                                onClick={() => setIsMobileFilterOpen(false)}
                            >
                                <X className="h-5 w-5" aria-hidden />
                            </button>
                        </div>

                        <div className="h-[calc(100vh-128px)] overflow-y-auto lg:h-auto" data-simplebar>
                            <div className="p-6 lg:p-0 divide-y divide-default-200">
                                <div>
                                    <button className="hs-collapse-toggle py-4 inline-flex justify-between items-center gap-2 transition-all uppercase font-medium text-lg text-default-900 w-full open" data-hs-collapse="#all_categories" id="hs-basic-collapse" type="button">
                                        Category
                                    </button>

                                    <div className="hs-collapse w-full overflow-hidden transition-[height] duration-300 open" id="all_categories">
                                        <div className="relative flex flex-col space-y-4 mb-6">
                                            <div className="flex items-center">
                                                <input
                                                    className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer"
                                                    id="category_all"
                                                    name="category_all"
                                                    type="checkbox"
                                                    checked={isAllCategoriesSelected}
                                                    onChange={(event) => handleAllCategoriesChange(event.target.checked)}
                                                />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="category_all">
                                                    All
                                                </label>
                                            </div>

                                            {categoriesLoading ? (
                                                <CategoryFilterSkeleton rows={6} />
                                            ) : categories.length === 0 ? (
                                                <p className="text-sm text-default-500">No categories available.</p>
                                            ) : (
                                                categories.map((category) => (
                                                    <div className="flex items-center" key={category.id}>
                                                        <input
                                                            className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer"
                                                            id={`category_${category.slug}`}
                                                            name={category.slug}
                                                            type="checkbox"
                                                            checked={selectedCategorySlugs.includes(category.slug)}
                                                            onChange={(event) =>
                                                                handleCategoryChange(category.slug, event.target.checked)
                                                            }
                                                        />
                                                        <label
                                                            className="ps-3 inline-flex items-center text-default-600 text-sm select-none"
                                                            htmlFor={`category_${category.slug}`}
                                                        >
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="block lg:hidden py-4 px-4 border-t border-default-200">
                            <a className="w-full inline-flex items-center justify-center rounded border border-primary bg-primary px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary focus:ring focus:ring-primary/50" href="javascript:void(0)">Reset</a>
                        </div>
                    </div>

                    <div className="lg:w-3/4">
                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-10">
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                                <button
                                    className="inline-flex lg:hidden items-center gap-4 text-sm py-2.5 px-4 xl:px-5 rounded-full text-default-950 border border-default-200 transition-all"
                                    type="button"
                                    onClick={() => setIsMobileFilterOpen(true)}
                                >
                                    Filter <Settings2 className="h-4 w-4" aria-hidden />
                                </button>

                                <h6 className="lg:flex hidden text-default-950 text-base">
                                    {!isLoading
                                        ? `Showing ${startItem}–${endItem} of ${total} results`
                                        : null}
                                </h6>
                            </div>
                        </div>

                        <div className="mb-5 w-full">
                            <div
                                className="relative rounded-lg overflow-hidden bg-primary/10 bg-cover bg-center w-full min-h-[280px]"
                                style={{ backgroundImage: "url('/images/other/discount.png')" }}
                            >
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="relative p-8 md:p-12">
                                    <h4 className="text-5xl text-yellow-500 font-semibold mb-6">
                                        52% Discount
                                    </h4>
                                    <p className="text-lg text-default-500 mb-6">on your first order</p>
                                    <button
                                        type="button"
                                        className="md:mb-10 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500"
                                    >
                                        Shop Now
                                        <ArrowRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            isLoading ? (
                                <ProductGridSkeleton count={6} />
                            ) : (
                                total === 0 ? (
                                    <div className="py-16 text-center text-sm text-default-500">
                                        No products found.
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                            {products.map((product) => (
                                                <ProductCard
                                                    key={product.id ?? product.name}
                                                    product={product}
                                                    categoryName={categoryNameBySlug.get(product.category)}
                                                />
                                            ))}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                                                <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 w-full md:w-auto ms-auto">
                                                    <button
                                                        type="button"
                                                        disabled={page <= 1}
                                                        onClick={() => setPage(page - 1)}
                                                        className="inline-flex items-center justify-center h-9 w-9 bg-default-100 rounded-full transition-all duration-500 text-default-800 hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                                                        aria-label="Previous page"
                                                    >
                                                        <ChevronLeft className="size-5" />
                                                    </button>

                                                    <span className="text-sm text-default-600">
                                                        Page {page} of {totalPages}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={page >= totalPages}
                                                        onClick={() => setPage(page + 1)}
                                                        className="inline-flex items-center justify-center h-9 w-9 bg-default-100 rounded-full transition-all duration-500 text-default-800 hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                                                        aria-label="Next page"
                                                    >
                                                        <ChevronRight className="size-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
