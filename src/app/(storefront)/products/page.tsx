import ProductGrid from '@/components/storefront/Products/ProductGrid'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Product Grid",
    description: "Product Grid",
};

export default function ProductGridPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductGrid />
        </Suspense>
    )
}

