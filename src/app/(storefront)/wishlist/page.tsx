import Wishlist from '@/components/storefront/Wishlist'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Wishlist",
    description: "Wishlist",
};

export default function WishlistPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Wishlist />
        </Suspense>
    )
}

