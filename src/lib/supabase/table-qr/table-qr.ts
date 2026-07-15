import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { generateTableQrCode } from "@/lib/table-qr/generate-code";
import { generateTableQrPng } from "@/lib/table-qr/generate-qr-png";
import { buildTableQrScanUrl } from "@/lib/table-qr/paths";
import type { ITableQrCode } from "@/types/table-qr";
import {
  deleteTableQrImage,
  uploadTableQrImage,
} from "@/lib/supabase/table-qr/storage";

const TABLE_QR_COLUMNS =
  "id, code, table_number, qr_image_url, scan_url, is_active, created_at, updated_at";

export type ListTableQrCodesResult =
  | { success: true; tableQrCodes: ITableQrCode[] }
  | { success: false; message: string; status: number };

export type TableQrMutationResult =
  | { success: true; tableQrCode: ITableQrCode }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

export type CreateTableQrBatchResult =
  | { success: true; tableQrCodes: ITableQrCode[] }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

export type DeleteTableQrResult =
  | { success: true }
  | { success: false; message: string; status: number };

async function createSingleTableQrWithSupabase(
  supabase: SupabaseClient,
  tableNumber: string,
  siteUrl: string,
): Promise<TableQrMutationResult> {
  const id = crypto.randomUUID();
  const code = generateTableQrCode();
  const scanUrl = buildTableQrScanUrl(siteUrl, code);

  const pngBuffer = await generateTableQrPng(scanUrl);
  const uploadResult = await uploadTableQrImage(supabase, id, pngBuffer);

  if (!uploadResult.success) {
    return {
      success: false,
      message: uploadResult.message,
      status: 500,
      errors: {},
    };
  }

  const { data, error } = await supabase
    .from("table_qr_codes")
    .insert({
      id,
      code,
      table_number: tableNumber,
      qr_image_url: uploadResult.qr_image_url,
      scan_url: scanUrl,
      is_active: true,
    })
    .select(TABLE_QR_COLUMNS)
    .single();

  if (error) {
    await deleteTableQrImage(supabase, id);
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  return {
    success: true,
    tableQrCode: data as ITableQrCode,
  };
}

export async function listTableQrCodesWithSupabase(
  supabase: SupabaseClient,
): Promise<ListTableQrCodesResult> {
  const { data, error } = await supabase
    .from("table_qr_codes")
    .select(TABLE_QR_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return {
    success: true,
    tableQrCodes: (data ?? []) as ITableQrCode[],
  };
}

export async function createTableQrBatchWithSupabase(
  supabase: SupabaseClient,
  tableNumbers: string[],
  siteUrl: string,
): Promise<CreateTableQrBatchResult> {
  const created: ITableQrCode[] = [];

  for (const tableNumber of tableNumbers) {
    const result = await createSingleTableQrWithSupabase(
      supabase,
      tableNumber,
      siteUrl,
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        status: result.status,
        errors: result.errors,
      };
    }

    created.push(result.tableQrCode);
  }

  return {
    success: true,
    tableQrCodes: created,
  };
}

export async function getActiveTableQrByCodeWithSupabase(
  supabase: SupabaseClient,
  code: string,
): Promise<TableQrMutationResult> {
  const normalizedCode = code.trim();
  if (!normalizedCode) {
    return {
      success: false,
      message: "Table QR code is required.",
      status: 400,
      errors: { code: "Table QR code is required." },
    };
  }

  const { data, error } = await supabase
    .from("table_qr_codes")
    .select(TABLE_QR_COLUMNS)
    .eq("code", normalizedCode)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Table QR code not found.",
      status: 404,
      errors: { code: "Table QR code not found." },
    };
  }

  return {
    success: true,
    tableQrCode: data as ITableQrCode,
  };
}

export async function updateTableQrActiveStatusWithSupabase(
  supabase: SupabaseClient,
  tableQrId: string,
  isActive: boolean,
): Promise<TableQrMutationResult> {
  const { data, error } = await supabase
    .from("table_qr_codes")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tableQrId)
    .select(TABLE_QR_COLUMNS)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Table QR code not found.",
      status: 404,
      errors: {},
    };
  }

  return {
    success: true,
    tableQrCode: data as ITableQrCode,
  };
}

export async function deleteTableQrWithSupabase(
  supabase: SupabaseClient,
  tableQrId: string,
): Promise<DeleteTableQrResult> {
  const { data, error: fetchError } = await supabase
    .from("table_qr_codes")
    .select("id")
    .eq("id", tableQrId)
    .maybeSingle();

  if (fetchError) {
    return {
      success: false,
      message: fetchError.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Table QR code not found.",
      status: 404,
    };
  }

  const deleteImageResult = await deleteTableQrImage(supabase, tableQrId);
  if (!deleteImageResult.success) {
    return {
      success: false,
      message: deleteImageResult.message,
      status: 500,
    };
  }

  const { error: deleteError } = await supabase
    .from("table_qr_codes")
    .delete()
    .eq("id", tableQrId);

  if (deleteError) {
    return {
      success: false,
      message: deleteError.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true };
}
