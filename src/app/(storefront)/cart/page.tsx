import Cart from '@/components/storefront/Cart'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
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

