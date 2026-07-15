import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveTableQrByCodeWithSupabase } from "@/lib/supabase/table-qr/table-qr";
import TableQrScanRedirect from "@/components/storefront/TableQrScanRedirect";
import { buildTableQrScanUrl, normalizeScanUrl } from "@/lib/table-qr/paths";

type PageProps = {
  params: Promise<{ code: string }>;
};

function resolveRequestOrigin(headersList: Headers): string | null {
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host");
  if (!host) return null;

  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host.split(",")[0]?.trim()}`;
}

export default async function TableQrScanPage({ params }: PageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code).trim();

  if (!decodedCode) {
    redirect("/home");
  }

  const adminClient = createAdminClient();
  const result = await getActiveTableQrByCodeWithSupabase(
    adminClient,
    decodedCode,
  );

  if (!result.success) {
    redirect("/home");
  }

  const { tableQrCode } = result;
  const storedScanUrl = tableQrCode.scan_url?.trim();

  if (storedScanUrl) {
    const headersList = await headers();
    const origin = resolveRequestOrigin(headersList);
    const currentScanUrl = origin
      ? buildTableQrScanUrl(origin, tableQrCode.code)
      : null;

    if (
      currentScanUrl &&
      normalizeScanUrl(storedScanUrl) !== normalizeScanUrl(currentScanUrl)
    ) {
      redirect(storedScanUrl);
    }
  }

  return (
    <TableQrScanRedirect
      tableNumber={tableQrCode.table_number}
      code={tableQrCode.code}
    />
  );
}
