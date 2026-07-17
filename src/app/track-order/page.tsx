import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Preloader from "@/components/layout/Preloader";

const TrackOrder = dynamic(
  () => import("@/components/storefront/TrackOrder"),
);

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "View live order, payment, product and delivery updates.",
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <TrackOrder />
    </Suspense>
  );
}
