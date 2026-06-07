
import Preloader from '@/components/layout/Preloader'
import { Suspense } from 'react'
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const Home = dynamic(() => import('@/components/storefront/Home'));

export const metadata: Metadata = {
    title: "Home Page",
    description: "Home Page",
};

export default function HomePage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Home />
        </Suspense>
    )
}

