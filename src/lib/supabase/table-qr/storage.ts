import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLE_QR_BUCKET } from "@/lib/constants";
import { getTableQrStoragePath } from "@/lib/table-qr/paths";

export type UploadTableQrImageResult =
  | { success: true; qr_image_url: string }
  | { success: false; message: string };

export async function uploadTableQrImage(
  supabase: SupabaseClient,
  id: string,
  pngBuffer: Buffer,
): Promise<UploadTableQrImageResult> {
  const storagePath = getTableQrStoragePath(id);

  const { error: uploadError } = await supabase.storage
    .from(TABLE_QR_BUCKET)
    .upload(storagePath, pngBuffer, {
      upsert: true,
      contentType: "image/png",
      cacheControl: "31536000",
    });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(TABLE_QR_BUCKET).getPublicUrl(storagePath);

  return { success: true, qr_image_url: publicUrl };
}

export async function deleteTableQrImage(
  supabase: SupabaseClient,
  id: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const storagePath = getTableQrStoragePath(id);

  const { error } = await supabase.storage
    .from(TABLE_QR_BUCKET)
    .remove([storagePath]);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
