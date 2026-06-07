import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic';
const ProductWrapper = dynamic(() => import('@/components/storefront/Products/ProductWrapper'));

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "All Products",
    description: "All Products",
};

export default function AllProductsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductWrapper />
        </Suspense>
    )
}

