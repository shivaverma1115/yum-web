import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';

import dynamic from 'next/dynamic';
import { UserRole } from '@/types/user';
const OrdersList = dynamic(() => import('@/components/admin/orders/OrdersList'));

export const metadata: Metadata = {
    title: "Admin Orders List",
    description: "Admin Orders List",
};
export default function AdminOrdersPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <OrdersList userRole={UserRole.ADMIN} />
        </Suspense>
    )
}

