import type { CreateTableQrInput, ITableQrCode } from "@/types/table-qr";

type ApiResult<T> =
  | { success: true; message?: string; data: T }
  | { success: false; message: string; errors?: Record<string, string> };

async function parseApiResponse<T>(response: Response): Promise<ApiResult<T>> {
  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    errors?: Record<string, string>;
    data?: T;
  };

  if (!response.ok || !payload.success) {
    return {
      success: false,
      message: payload.message ?? "Request failed.",
      errors: payload.errors,
    };
  }

  return {
    success: true,
    message: payload.message,
    data: payload.data as T,
  };
}

export async function fetchTableQrCodes(): Promise<
  ApiResult<{ tableQrCodes: ITableQrCode[] }>
> {
  const response = await fetch("/api/admin/table-qr", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<{ tableQrCodes: ITableQrCode[] }>(response);
}

export async function createTableQrCodes(
  input: CreateTableQrInput,
): Promise<ApiResult<{ tableQrCodes: ITableQrCode[] }>> {
  const response = await fetch("/api/admin/table-qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseApiResponse<{ tableQrCodes: ITableQrCode[] }>(response);
}

export async function deleteTableQrCode(
  tableQrId: string,
): Promise<ApiResult<Record<string, never>>> {
  const response = await fetch(`/api/admin/table-qr/${tableQrId}`, {
    method: "DELETE",
  });

  return parseApiResponse<Record<string, never>>(response);
}

export async function updateTableQrActiveStatus(
  tableQrId: string,
  isActive: boolean,
): Promise<ApiResult<{ tableQrCode: ITableQrCode }>> {
  const response = await fetch(`/api/admin/table-qr/${tableQrId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: isActive }),
  });

  return parseApiResponse<{ tableQrCode: ITableQrCode }>(response);
}

export function openTableQrDownload(qrImageUrl: string): void {
  window.open(qrImageUrl, "_blank", "noopener,noreferrer");
}
