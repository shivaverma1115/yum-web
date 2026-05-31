import SellersList from '@/components/admin/sellers/SellersList'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Sellers",
    description: "Sellers",
};
export default function AdminSellerListPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <SellersList />
        </Suspense>
    )
}

