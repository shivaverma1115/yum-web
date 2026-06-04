import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const UserAddWrapper = dynamic(() => import('./components/UserAddWrapper'));

export const metadata: Metadata = {
    title: "Customer Details",
    description: "Customer Details",
};

export default function CustomerAddPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <UserAddWrapper />
        </Suspense>
    )
}

