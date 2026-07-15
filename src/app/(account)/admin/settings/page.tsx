import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const AdminProfileSetting = dynamic(() => import('@/components/admin/settings/ProfileSetting'));

export const metadata: Metadata = {
    title: "Admin Profile Settings",
    description: "Admin Profile Settings",
};
export default function AdminProfileSettingsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AdminProfileSetting />
        </Suspense>
    )
}
