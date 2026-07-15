import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const Userslist = dynamic(() => import('@/components/admin/customer/Userslist'));

export const metadata: Metadata = {
    title: "Customers",
    description: "Customers",
};
export default function AdminCustomersPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Userslist />
        </Suspense>
    )
}

