import AdminDashboard from '@/components/admin/dashboard/AdminDashboard'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard",
};
export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AdminDashboard />
        </Suspense>
    )
}

