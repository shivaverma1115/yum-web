import Faqs from '@/components/storefront/Faqs'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "FAQs",
    description: "FAQs",
};

export default function FaqsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Faqs />
        </Suspense>
    )
}

