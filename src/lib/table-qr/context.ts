const TABLE_QR_CONTEXT_KEY = "yum-table-qr-context";

export type TableQrContext = {
  table_number: string;
  code: string;
};

export function saveTableQrContext(context: TableQrContext): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TABLE_QR_CONTEXT_KEY, JSON.stringify(context));
}

export function loadTableQrContext(): TableQrContext | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(TABLE_QR_CONTEXT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<TableQrContext>;
    if (!parsed.table_number?.trim() || !parsed.code?.trim()) {
      return null;
    }

    return {
      table_number: parsed.table_number.trim(),
      code: parsed.code.trim(),
    };
  } catch {
    return null;
  }
}

export function clearTableQrContext(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TABLE_QR_CONTEXT_KEY);
}
