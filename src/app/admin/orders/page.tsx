import OrdersList from '@/components/admin/orders/OrdersList'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Orders",
    description: "Orders",
};
export default function AdminOrdersPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <OrdersList />
        </Suspense>
    )
}

