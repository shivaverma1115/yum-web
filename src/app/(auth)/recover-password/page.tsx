import RecoverPassword from '@/components/auth/RecoverPassword'
import Preloader from '@/components/layout/Preloader'
import { Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Recover Password",
    description: "Recover your password",
};

export default function RecoverPasswordPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <RecoverPassword />
        </Suspense>
    )
}

