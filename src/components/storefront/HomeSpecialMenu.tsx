"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/storefront/Products/ProductCard";
import { ProductGridSkeleton } from "@/components/skeleton";
import { useStorefrontCatalog } from "@/hooks/use-storefront-catalog";
import { cn } from "@/lib/utils/helpers";

// Keep the homepage section compact. The full catalog remains available at /products.
const HOME_MENU_LIMIT = 6;

/**
 * Home “Special Menu” — category rail + product grid.
 * Uses the same catalog hook / API filter as ProductWrapper.
 */
export default function HomeSpecialMenu() {
  const {
    products,
    categories,
    categoriesLoading,
    selectedCategorySlugs,
    isLoading,
    isAllCategoriesSelected,
    categoryNameBySlug,
    selectSingleCategory,
  } = useStorefrontCatalog({ limit: HOME_MENU_LIMIT });

  const activeCategory = useMemo(() => {
    if (isAllCategoriesSelected) return null;
    const slug = selectedCategorySlugs[0];
    return categories.find((category) => category.slug === slug) ?? null;
  }, [categories, isAllCategoriesSelected, selectedCategorySlugs]);

  const loading = categoriesLoading || isLoading;
  const categoryItems = useMemo(
    () => [
      { id: "__all__", slug: null as string | null, name: "All dishes" },
      ...categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
      })),
    ],
    [categories],
  );

  return (
    <section
      id="special-menu"
      className="max-w-full overflow-hidden scroll-mt-28 py-6 lg:py-16"
    >
      <div className="container min-w-0">
        <div className="grid min-w-0 gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          <aside className="min-w-0 lg:col-span-3">
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <span className="mb-3 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                Menu
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-default-900 sm:text-3xl">
                Special Menu for you
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-default-500">
                Choose a category to explore dishes tailored to your taste.
              </p>
            </div>

            <div className="lg:sticky lg:top-28">
              <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-default-400 lg:block">
                Categories
              </p>

              {categoriesLoading ? (
                <div className="flex gap-2 lg:flex-col" aria-busy="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-11 w-28 animate-pulse rounded-lg bg-default-100 lg:w-full"
                    />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="rounded-lg border border-dashed border-default-200 px-4 py-6 text-sm text-default-500">
                  Categories will appear here once products are added.
                </p>
              ) : (
                <nav
                  className="-mx-4 max-w-[calc(100vw)] overflow-x-auto px-4 pb-1 lg:mx-0 lg:max-w-none lg:overflow-visible lg:px-0 lg:pb-0"
                  aria-label="Menu categories"
                >
                  <ul className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col lg:gap-1">
                    {categoryItems.map((item) => {
                      const isActive =
                        item.slug === null
                          ? isAllCategoriesSelected
                          : !isAllCategoriesSelected &&
                            selectedCategorySlugs.includes(item.slug);

                      return (
                        <li key={item.id} className="shrink-0 lg:shrink">
                          <button
                            type="button"
                            onClick={() => selectSingleCategory(item.slug)}
                            aria-pressed={isActive}
                            className={cn(
                              "group flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors",
                              "lg:border-transparent",
                              isActive
                                ? "border-primary/30 bg-primary text-white shadow-sm lg:border-l-2 lg:border-l-primary lg:bg-primary/10 lg:text-primary lg:shadow-none"
                                : "border-default-200 bg-white text-default-700 hover:border-primary/20 hover:bg-primary/5 hover:text-primary dark:bg-default-50 lg:border-transparent lg:bg-transparent",
                            )}
                          >
                            <span className="truncate">{item.name}</span>
                            <ChevronRight
                              className={cn(
                                "hidden h-4 w-4 shrink-0 transition-transform lg:block",
                                isActive
                                  ? "translate-x-0.5 text-primary"
                                  : "text-default-300 group-hover:text-primary",
                              )}
                              aria-hidden
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-9">
            <div className="min-w-0 rounded-xl border border-default-200/80 bg-gradient-to-b from-primary/[0.07] to-transparent p-3 sm:rounded-2xl sm:p-6 lg:p-8">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-default-200/70 pb-4 sm:mb-6 sm:pb-5">
                <div>
                  <h3 className="text-xl font-semibold text-default-900">
                    {isAllCategoriesSelected
                      ? "All dishes"
                      : (activeCategory?.name ?? "Menu")}
                  </h3>
                  <p className="mt-1 text-sm text-default-500">
                    {loading
                      ? "Loading dishes…"
                      : products.length === 0
                        ? "No dishes in this category yet."
                        : `${products.length} dish${products.length === 1 ? "" : "es"} available`}
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View full menu
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              {loading ? (
                <ProductGridSkeleton count={6} />
              ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-default-200 bg-white/70 px-6 py-16 text-center dark:bg-default-50/40">
                  <p className="text-sm text-default-500">
                    Nothing here yet. Try another category or browse the full
                    menu.
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                <ul className="grid min-w-0 list-none gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                  {products.map((product) => (
                    <li
                      key={product.id ?? product.slug}
                      className="min-w-0"
                    >
                      <ProductCard
                        product={product}
                        categoryName={
                          activeCategory?.name ??
                          categoryNameBySlug.get(product.category)
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
