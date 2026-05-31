import UserDetailsForm from '@/components/admin/customer/UserDetailsForm'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Customer Details",
    description: "Customer Details",
};

export default function CustomerAddPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <UserDetailsForm />
        </Suspense>
    )
}

