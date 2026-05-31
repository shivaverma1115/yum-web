import Home from '@/components/storefront/Home'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Home",
    description: "Home",
};

export default function HomePage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Home />
        </Suspense>
    )
}

