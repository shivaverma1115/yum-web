import Faqs from '@/components/storefront/Faqs'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { createStorefrontMetadata } from '@/lib/seo/create-storefront-metadata';

export async function generateMetadata() {
    return createStorefrontMetadata("faqs");
}

export default function FaqsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Faqs />
        </Suspense>
    )
}
