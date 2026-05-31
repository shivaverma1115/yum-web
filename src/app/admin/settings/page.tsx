import AdminSetting from '@/components/admin/settings/AdminSetting'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
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

