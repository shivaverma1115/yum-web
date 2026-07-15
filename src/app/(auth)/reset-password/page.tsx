import ResetPassword from '@/components/auth/ResetPassword'
import Preloader from '@/components/layout/Preloader'
import { Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset your password",
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <ResetPassword />
        </Suspense>
    )
}

