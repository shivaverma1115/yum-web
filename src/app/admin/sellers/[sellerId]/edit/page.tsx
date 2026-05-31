import SellerForm from '@/components/admin/sellers/SellerForm'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Seller Details",
    description: "Seller Details",
};
export default function AdminSellerEditPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <SellerForm />
        </Suspense>
    )
}

