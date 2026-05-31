import ProductList from '@/components/storefront/Products/ProductList'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Product List",
    description: "Product List",
};

export default function ProductListPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductList />
        </Suspense>
    )
}

