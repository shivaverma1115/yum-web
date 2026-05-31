import AdminManage from '@/components/admin/manage/AdminManage'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Manage",
    description: "Manage",
};
export default function AdminManagePage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AdminManage />
        </Suspense>
    )
}

