import {
  ALLOWED_PRODUCT_IMAGE_TYPES,
  MAX_PRODUCT_IMAGE_SIZE_BYTES,
} from "@/lib/constants";

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export function validateProductImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_PRODUCT_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_PRODUCT_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      message: `"${file.name}" must be JPEG, PNG, or WebP.`,
    };
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      message: `"${file.name}" is ${sizeMb} MB. Maximum allowed size is 1 MB.`,
    };
  }

  return { valid: true };
}

export function validateProductImageFiles(files: File[]): ImageValidationResult {
  if (!files.length) {
    return { valid: false, message: "Please select at least one product image." };
  }

  for (const file of files) {
    const result = validateProductImageFile(file);
    if (!result.valid) return result;
  }

  return { valid: true };
}
