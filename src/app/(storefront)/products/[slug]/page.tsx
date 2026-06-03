import ProductDetails from '@/components/storefront/Products/ProductDetails'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';

interface ProductDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const metadata: Metadata = {
    title: "Product Details",
    description: "View product details",
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;

    return (
        <Suspense fallback={<Preloader />}>
            <ProductDetails slug={slug} />
        </Suspense>
    )
}

