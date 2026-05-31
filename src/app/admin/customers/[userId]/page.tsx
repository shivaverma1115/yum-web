import UserDetails from '@/components/admin/customer/UserDetails';
import Preloader from '@/components/layout/Preloader';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface CustomerDetailsPageProps {
    params: Promise<{
        userId: string;
    }>;
}

export const metadata: Metadata = {
    title: "Customer Details",
    description: "Customer Details",
};

export default async function CustomerDetailsPage({
    params,
}: CustomerDetailsPageProps) {
    const { userId } = await params;

    return (
        <Suspense fallback={<Preloader />}>
            <UserDetails userId={userId} />
        </Suspense>
    );
}