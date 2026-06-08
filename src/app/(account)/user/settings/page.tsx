import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ProfileSetting = dynamic(() => import('@/components/admin/settings/ProfileSetting'));

export const metadata: Metadata = {
    title: "User Profile Settings",
    description: "User Profile Settings",
};
export default function ProfileSettingsPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ProfileSetting />
        </Suspense>
    )
}

