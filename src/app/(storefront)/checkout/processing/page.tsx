import Preloader from "@/components/layout/Preloader";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentProcessing = dynamic(
  () => import("@/components/storefront/PaymentProcessing"),
);

export const metadata: Metadata = {
  title: "Processing Payment",
  description: "Confirming your payment",
};

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <PaymentProcessing />
    </Suspense>
  );
}
