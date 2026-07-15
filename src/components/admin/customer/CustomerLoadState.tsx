"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { IUserWithVerification } from "@/types/user";
import { FormSectionSkeleton } from "@/components/skeleton";

type CustomerLoadStateProps = {
  user: IUserWithVerification | null;
  loading: boolean;
  error: string | null;
  children: (user: IUserWithVerification) => ReactNode;
};

export default function CustomerLoadState({
  user,
  loading,
  error,
  children,
}: CustomerLoadStateProps) {
  if (loading) {
    return <FormSectionSkeleton fields={8} />;
  }

  if (error || !user) {
    return (
      <div className="rounded-lg border border-default-200 p-6 text-center">
        <p className="text-sm text-red-600 mb-4">
          {error ?? "Customer not found."}
        </p>
        <Link
          href="/admin/customers"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  return <>{children(user)}</>;
}
