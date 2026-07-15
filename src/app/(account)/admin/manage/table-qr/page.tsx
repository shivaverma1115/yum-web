import { Metadata } from "next";
import TableQrManager from "@/components/admin/table-qr/TableQrManager";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { listTableQrCodesWithSupabase } from "@/lib/supabase/table-qr/table-qr";
import type { ITableQrCode } from "@/types/table-qr";

export const metadata: Metadata = {
  title: "Table QR Codes",
  description: "Generate and manage dine-in table QR codes",
};

export default async function AdminTableQrPage() {
  let initialTableQrCodes: ITableQrCode[] = [];

  const auth = await requireAdmin();
  if (auth.authorized) {
    const result = await listTableQrCodesWithSupabase(createAdminClient());
    if (result.success) {
      initialTableQrCodes = result.tableQrCodes;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-default-900">Table QR Codes</h3>
        <p className="mt-1 text-sm text-default-600">
          Generate unique QR codes for dine-in tables. Customers scan to open your
          menu with their table number pre-filled.
        </p>
      </div>

      <TableQrManager initialTableQrCodes={initialTableQrCodes} />
    </div>
  );
}
