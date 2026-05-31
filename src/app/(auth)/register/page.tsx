import Register from '@/components/auth/Register'
import Preloader from '@/components/layout/Preloader'
import { Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Register",
    description: "Register to your Yum account",
};

export default function RegisterPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Register />
        </Suspense>
    )
}

