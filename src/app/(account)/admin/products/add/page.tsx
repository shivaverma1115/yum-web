import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ProductForm = dynamic(() => import('@/components/admin/products/ProductForm'));

export const metadata: Metadata = {
    title: "Admin - Add Product",
    description: "Admin - Add Product",
};
export default function AdminProductAddPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProductForm />
        </Suspense>
    )
}

