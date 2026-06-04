import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ProductDetails = dynamic(() => import('@/components/admin/products/ProductDetails'));
interface AdminProductDetailsPageProps {
    params: Promise<{
        productId: string;
    }>;
}

export const metadata: Metadata = {
    title: "Product Details",
    description: "Product Details",
};

export default async function AdminProductDetailsPage({
    params,
}: AdminProductDetailsPageProps) {
    const { productId } = await params;

    return (
        <Suspense fallback={<Preloader />}>
            <ProductDetails productId={productId} />
        </Suspense>
    )
}

