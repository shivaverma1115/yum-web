import ResturantDetails from '@/components/admin/resturants/ResturantDetails'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
interface RestaurantDetailsPageProps {
    params: Promise<{
        restaurantId: string;
    }>;
}
export const metadata: Metadata = {
    title: "Restaurant Details",
    description: "Restaurant Details",
};

export default async function RestaurantDetailsPage({ params }: RestaurantDetailsPageProps) {
    const { restaurantId } = await params;

    return (
        <Suspense fallback={<Preloader />}>
            <ResturantDetails restaurantId={restaurantId} />
        </Suspense>
    )
}

