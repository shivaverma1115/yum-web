"use client";
import ProductForm from '@/components/admin/products/ProductForm'
import ProductLoadState from '@/components/admin/products/ProductLoadState';
import { useAdminProduct } from '@/hooks/use-admin-products';
import { useParams } from 'next/navigation';
import React from 'react'

export default function ProductEditWrapper() {
  const params = useParams();
  const productId = typeof params.productId === "string" ? params.productId : "";
  const { product, loading, error } = useAdminProduct(productId);
  return (
    <ProductLoadState product={product} loading={loading} error={error}>
      {(product) => <ProductForm product={product} />}
    </ProductLoadState>
  )
}

