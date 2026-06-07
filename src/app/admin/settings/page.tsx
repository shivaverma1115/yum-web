import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const AdminSetting = dynamic(() => import('@/components/admin/settings/AdminSetting'));

export const metadata: Metadata = {
    title: "Settings",
    description: "Settings",
};
export default function AdminSettingsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AdminSetting />
        </Suspense>
    )
}

