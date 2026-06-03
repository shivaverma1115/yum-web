import type { SupabaseClient } from "@supabase/supabase-js";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/constants";
import {
  validateProductImageFiles,
  type ImageValidationResult,
} from "@/lib/products/imageValidation";

export type UploadProductImagesResult =
  | { success: true; image_url: string; image_urls: string[] }
  | { success: false; message: string };

function getFileExtension(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "png";
}

function getStoragePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex < 0) return null;

  const encodedPath = url.slice(markerIndex + marker.length);
  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

export async function uploadProductImages(
  supabase: SupabaseClient,
  files: File[],
  productId: string,
): Promise<UploadProductImagesResult> {
  const validation: ImageValidationResult = validateProductImageFiles(files);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  const uploadBatch = Date.now();
  const baseFolder = `products/${productId}/${uploadBatch}`;
  const uploadedUrls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const folderName = index === 0 ? "cover" : "gallery";
    const extension = getFileExtension(file.name);
    const filePath = `${baseFolder}/${folderName}/${index + 1}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      return { success: false, message: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);
  }

  return {
    success: true,
    image_url: uploadedUrls[0] ?? "",
    image_urls: uploadedUrls,
  };
}

export async function deleteProductImagesByUrls(
  supabase: SupabaseClient,
  imageUrls: string[],
): Promise<{ success: true } | { success: false; message: string }> {
  const uniquePaths = Array.from(
    new Set(
      imageUrls
        .map((url) => getStoragePathFromPublicUrl(url))
        .filter((path): path is string => Boolean(path)),
    ),
  );

  if (!uniquePaths.length) {
    return { success: true };
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove(uniquePaths);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
