"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { fetchProductCategories } from "@/lib/api/categories";
import { fetchProductsPage } from "@/lib/products/products";
import type { IProductCategory } from "@/types/product-category";
import type { IProduct } from "@/types/product";

export type UseStorefrontCatalogOptions = {
  /** Page size for product fetches. Default 10. */
  limit?: number;
};

/**
 * Shared storefront catalog: product-associated categories + paginated products.
 * Category filter matches ProductWrapper (API `categories` query, empty = All).
 */
export function useStorefrontCatalog(options: UseStorefrontCatalogOptions = {}) {
  const limit = options.limit ?? 10;

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    [],
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isAllCategoriesSelected = selectedCategorySlugs.length === 0;

  const categoryNameBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.slug, category.name);
    }
    return map;
  }, [categories]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadCategories = async () => {
      setCategoriesLoading(true);

      try {
        const data = await fetchProductCategories(controller.signal);
        if (!active) return;
        setCategories(data);
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load categories.",
        );
        setCategories([]);
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const handleAllCategoriesChange = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedCategorySlugs([]);
      setPage(1);
    }
  }, []);

  const handleCategoryChange = useCallback((slug: string, checked: boolean) => {
    setSelectedCategorySlugs((current) => {
      if (checked) {
        return [...current, slug];
      }
      return current.filter((value) => value !== slug);
    });
    setPage(1);
  }, []);

  /** Home menu: pick one category, or null for All. */
  const selectSingleCategory = useCallback((slug: string | null) => {
    setSelectedCategorySlugs(slug ? [slug] : []);
    setPage(1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const data = await fetchProductsPage({
          page,
          limit,
          categories: isAllCategoriesSelected
            ? undefined
            : selectedCategorySlugs,
          signal: controller.signal,
          endpoint: "/api/products",
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
  }, [page, selectedCategorySlugs, isAllCategoriesSelected, limit]);

  return {
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
    selectSingleCategory,
    limit,
  };
}
