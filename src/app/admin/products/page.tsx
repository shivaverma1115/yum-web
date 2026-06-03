import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ProductsList = dynamic(() => import('@/components/admin/products/ProductsList'));

export const metadata: Metadata = {
    title: "Products",
    description: "Products",
};

export default async function AdminProductListPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductsList />
        </Suspense>
    )
}

