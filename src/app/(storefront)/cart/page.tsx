import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const Cart = dynamic(() => import('@/components/storefront/Cart'));

export const metadata: Metadata = {
    title: "Cart",
    description: "Cart",
};

export default function CartPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Cart />
        </Suspense>
    )
}

