import ProductForm from '@/components/admin/products/ProductForm'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Product Details",
    description: "Product Details",
};
export default function AdminProductEditPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductForm />
        </Suspense>
    )
}

