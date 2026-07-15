import type { CreateTableQrInput } from "@/types/table-qr";
import { buildTableNumberRange } from "@/lib/table-qr/table-numbers";

const MAX_BULK_TABLE_QR_COUNT = 100;

export type ParsedCreateTableQrInput =
  | { success: true; tableNumbers: string[] }
  | { success: false; message: string; errors: Record<string, string> };

function invalid(
  message: string,
  errors: Record<string, string>,
): ParsedCreateTableQrInput {
  return { success: false, message, errors };
}

export function parseCreateTableQrPayload(
  body: unknown,
): ParsedCreateTableQrInput {
  if (!body || typeof body !== "object") {
    return invalid("Invalid request body.", { body: "Invalid request body." });
  }

  const payload = body as Partial<CreateTableQrInput>;

  if (payload.mode === "single") {
    const tableNumber = payload.table_number?.trim() ?? "";
    if (!tableNumber) {
      return invalid("Table number is required.", {
        table_number: "Table number is required.",
      });
    }

    return { success: true, tableNumbers: [tableNumber] };
  }

  if (payload.mode === "range") {
    const from = Number(payload.from);
    const to = Number(payload.to);

    if (!Number.isInteger(from) || from < 1) {
      return invalid("Start number must be a positive integer.", {
        from: "Start number must be a positive integer.",
      });
    }

    if (!Number.isInteger(to) || to < from) {
      return invalid("End number must be greater than or equal to start.", {
        to: "End number must be greater than or equal to start.",
      });
    }

    const tableNumbers = buildTableNumberRange(from, to, payload.prefix);
    if (tableNumbers.length > MAX_BULK_TABLE_QR_COUNT) {
      return invalid(
        `You can generate up to ${MAX_BULK_TABLE_QR_COUNT} QR codes at once.`,
        { to: `Maximum ${MAX_BULK_TABLE_QR_COUNT} QR codes per request.` },
      );
    }

    return { success: true, tableNumbers };
  }

  return invalid("Generation mode is required.", {
    mode: 'Use mode "single" or "range".',
  });
}
