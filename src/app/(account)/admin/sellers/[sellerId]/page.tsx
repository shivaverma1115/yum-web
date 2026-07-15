import SellerDetails from '@/components/admin/sellers/SellerDetails';
import Preloader from '@/components/layout/Preloader';
import React, { Suspense } from 'react'
import { Metadata } from 'next';
interface AdminSellerDetailsPageProps {
    params: Promise<{
        sellerId: string;
    }>;
}
export const metadata: Metadata = {
    title: "Seller Details",
    description: "Seller Details",
};

export default async function AdminSellerDetailsPage({ params }: AdminSellerDetailsPageProps) {
    const { sellerId } = await params;

    return (
        <Suspense fallback={<Preloader />}>
            <SellerDetails sellerId={sellerId} />
        </Suspense>
    )
}

