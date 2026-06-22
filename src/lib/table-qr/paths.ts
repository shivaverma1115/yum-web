import { TABLE_QR_BUCKET } from "@/lib/constants";

export const TABLE_QR_SCAN_ROUTE_PREFIX = "/t";

export function getTableQrScanPath(code: string): string {
  const normalizedCode = code.trim();
  return `${TABLE_QR_SCAN_ROUTE_PREFIX}/${encodeURIComponent(normalizedCode)}`;
}

export function buildTableQrScanUrl(siteUrl: string, code: string): string {
  const base = siteUrl.trim().replace(/\/$/, "");
  return `${base}${getTableQrScanPath(code)}`;
}

export function normalizeScanUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    parsed.hash = "";
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    return `${parsed.origin}${pathname}${parsed.search}`;
  } catch {
    return url.trim().replace(/\/$/, "");
  }
}

export function getTableQrStoragePath(id: string): string {
  return `table-qr/${id}/qr.png`;
}

export function getTableQrStoragePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${TABLE_QR_BUCKET}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex < 0) return null;

  const encodedPath = url.slice(markerIndex + marker.length);
  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}
