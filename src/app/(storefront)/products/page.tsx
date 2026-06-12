import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic';
import { createStorefrontMetadata } from '@/lib/seo/create-storefront-metadata';

const ProductWrapper = dynamic(() => import('@/components/storefront/Products/ProductWrapper'));

export async function generateMetadata() {
    return createStorefrontMetadata("products");
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductWrapper />
        </Suspense>
    )
}
