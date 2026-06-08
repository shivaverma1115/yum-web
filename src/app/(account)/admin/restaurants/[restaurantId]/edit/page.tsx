import ResturantForm from '@/components/admin/resturants/ResturantForm'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Restaurant Details",
    description: "Restaurant Details",
};
export default function RestaurantEditPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ResturantForm />
        </Suspense>
    )
}

