import Contact from '@/components/storefront/Contact'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { createStorefrontMetadata } from '@/lib/seo/create-storefront-metadata';

export async function generateMetadata() {
    return createStorefrontMetadata("contact");
}

export default function ContactPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Contact />
        </Suspense>
    )
}
