import Checkout from '@/components/storefront/Checkout'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Checkout",
    description: "Checkout",
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Checkout />
        </Suspense>
    )
}

