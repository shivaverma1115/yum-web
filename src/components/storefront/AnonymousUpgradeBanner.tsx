"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContextApi } from "@/context-api/use-context";

type AnonymousUpgradeBannerProps = {
  className?: string;
};

export default function AnonymousUpgradeBanner({
  className = "",
}: AnonymousUpgradeBannerProps) {
  const { isAnonymous } = useContextApi();
  const pathname = usePathname();

  if (!isAnonymous) {
    return null;
  }

  const redirectTo = encodeURIComponent(pathname || "/user/orders");

  return (
    <div
      className={`rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      role="status"
    >
      <p className="font-medium">Save your orders</p>
      <p className="mt-1 text-amber-900/90">
        Create an account to access your order history from any device.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          href={`/register?redirectTo=${redirectTo}`}
          className="inline-flex items-center rounded-full border border-amber-300 bg-white px-4 py-1.5 text-sm font-medium text-amber-950 transition hover:bg-amber-100"
        >
          Create account
        </Link>
        <Link
          href={`/login?redirectTo=${redirectTo}`}
          className="inline-flex items-center text-sm font-medium text-amber-900 underline underline-offset-2"
        >
          Sign in to existing account
        </Link>
      </div>
    </div>
  );
}
