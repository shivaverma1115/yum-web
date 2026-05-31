import Contact from '@/components/storefront/Contact'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Contact",
    description: "Contact",
};

export default function ContactPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Contact />
        </Suspense>
    )
}

