import ProductsList from '@/components/admin/products/ProductsList'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Products",
    description: "Products",
};
export default function AdminProductListPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductsList />
        </Suspense>
    )
}

