"use client";

import { useEffect, useState } from "react";
import type { IUser } from "@/types/user";
import { IProduct } from "@/types/product";

type ProductResponse = {
  success: boolean;
  message?: string;
  data?: { product: IProduct };
};

export function getProductName(product: IProduct) {
  return product.name;
}

export function useAdminProduct(productId: string) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Invalid product id.");
      setProduct(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          signal: controller.signal,
        });
        const data = (await response.json().catch(
          () => ({}),
        )) as ProductResponse;

        if (!active) return;

        if (!response.ok || !data.success || !data.data?.product) {
          setError(data.message ?? "Failed to load product.");
          setProduct(null);
          return;
        }

        setProduct(data.data.product);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load product.",
        );
        setProduct(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      active = false;
      controller.abort();
    };
  }, [productId]);

  return { product, loading, error };
}
