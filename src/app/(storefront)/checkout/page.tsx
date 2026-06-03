
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const Checkout = dynamic(() => import('@/components/storefront/Checkout'));

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

