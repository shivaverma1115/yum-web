import { IProduct } from '@/types/product';
import Link from 'next/link';
import React, { ReactNode } from 'react'
import { FormSectionSkeleton } from '@/components/skeleton';

type ProductLoadStateProps = {
    product: IProduct | null;
    loading: boolean;
    error: string | null;
    children: (product: IProduct) => ReactNode;
};

export default function ProductLoadState({
    product,
    loading,
    error,
    children,
}: ProductLoadStateProps) {
    if (loading) {
        return <FormSectionSkeleton fields={10} />;
    }

    if (error || !product) {
        return (
            <div className="rounded-lg border border-default-200 p-6 text-center">
                <p className="text-sm text-red-600 mb-4">
                    {error ?? "Product not found."}
                </p>
                <Link
                    href="/admin/products"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Back to products
                </Link>
            </div>
        );
    }

    return <>{children(product)}</>;
}