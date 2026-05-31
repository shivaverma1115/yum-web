import MarketingUI from '@/components/marketing/MarketingUI'
import Preloader from '@/components/layout/Preloader'
import { Suspense } from 'react'
import { Metadata } from 'next';
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

