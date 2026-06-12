import Home from '@/components/storefront/Home'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { createStorefrontMetadata } from '@/lib/seo/create-storefront-metadata';

export async function generateMetadata() {
    return createStorefrontMetadata("home", { path: "/home" });
}

export default function HomePage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Home />
        </Suspense>
    )
}
