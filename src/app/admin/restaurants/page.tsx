import ResturantsList from '@/components/admin/resturants/ResturantsList'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Restaurants",
    description: "Restaurants",
};
export default function RestaurantsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ResturantsList />
        </Suspense>
    )
}

