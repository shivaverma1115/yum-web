import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';

import dynamic from 'next/dynamic';
import { UserRole } from '@/types/user';
const OrdersList = dynamic(() => import('@/components/admin/orders/OrdersList'));

export const metadata: Metadata = {
    title: "User Orders List",
    description: "User Orders List",
};
export default function UserOrdersPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <OrdersList userRole={UserRole.USER} />
        </Suspense>
    )
}

