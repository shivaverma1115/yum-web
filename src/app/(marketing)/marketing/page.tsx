import Preloader from '@/components/layout/Preloader'
import { Suspense } from 'react'
import { Metadata } from 'next';

import dynamic from 'next/dynamic';
const MarketingUI = dynamic(() => import('@/components/marketing/MarketingUI'));

export const metadata: Metadata = {
    title: "Marketing",
    description: "Marketing",
};

export default function MarketingUIPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <MarketingUI />
        </Suspense>
    )
}

