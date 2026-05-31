import AdminWallet from '@/components/admin/wallet/AdminWallet'
import Preloader from '@/components/layout/Preloader'
import React, { Suspense } from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Wallet",
    description: "Wallet",
};
export default function AdminWalletPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AdminWallet />
        </Suspense>
    )
}

