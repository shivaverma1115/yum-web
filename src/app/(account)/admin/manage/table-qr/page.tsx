import Preloader from "@/components/layout/Preloader";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const TableQrManager = dynamic(
  () => import("@/components/admin/table-qr/TableQrManager"),
);

export const metadata: Metadata = {
  title: "Table QR Codes",
  description: "Generate and manage dine-in table QR codes",
};

export default function AdminTableQrPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-default-900">Table QR Codes</h3>
        <p className="mt-1 text-sm text-default-600">
          Generate unique QR codes for dine-in tables. Customers scan to open your
          menu with their table number pre-filled.
        </p>
      </div>

      <Suspense fallback={<Preloader />}>
        <TableQrManager />
      </Suspense>
    </div>
  );
}
