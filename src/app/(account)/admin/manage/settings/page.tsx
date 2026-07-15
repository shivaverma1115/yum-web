import Preloader from "@/components/layout/Preloader";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const BusinessSettingsForm = dynamic(
  () => import("@/components/admin/business-settings/BusinessSettingsForm"),
);

export const metadata: Metadata = {
  title: "Business Settings",
  description: "Manage site-wide business settings",
};

export default function AdminBusinessSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-default-900">
          Business Settings
        </h3>
        <p className="mt-1 text-sm text-default-600">
          Configure site, order, payment, and verification options for your store.
        </p>
      </div>

      <Suspense fallback={<Preloader />}>
        <BusinessSettingsForm />
      </Suspense>
    </div>
  );
}
