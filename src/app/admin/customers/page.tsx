import Userslist from '@/components/admin/customer/Userslist'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
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

