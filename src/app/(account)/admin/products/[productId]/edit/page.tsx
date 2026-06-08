import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ProductEditWrapper = dynamic(() => import('./components/ProductEditWrapper'));

export const metadata: Metadata = {
    title: "Edit Product",
    description: "Edit product details",
};

export default function AdminProductEditPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductEditWrapper />
        </Suspense>
    )
}

