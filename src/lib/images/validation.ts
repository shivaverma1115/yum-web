import {
  ALLOWED_PRODUCT_IMAGE_TYPES,
  MAX_PRODUCT_IMAGE_SIZE_BYTES,
} from "@/lib/constants";

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };

type ValidateImageOptions = {
  maxSizeBytes?: number;
  allowedTypes?: readonly string[];
};

export function validateImageFile(
  file: File,
  options: ValidateImageOptions = {},
): ImageValidationResult {
  const allowedTypes = options.allowedTypes ?? ALLOWED_PRODUCT_IMAGE_TYPES;
  const maxSizeBytes = options.maxSizeBytes ?? MAX_PRODUCT_IMAGE_SIZE_BYTES;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `"${file.name}" must be JPEG, PNG, or WebP.`,
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      message: `"${file.name}" is ${sizeMb} MB. Maximum allowed size is ${maxMb} MB.`,
    };
  }

  return { valid: true };
}

export function validateImageFiles(
  files: File[],
  options: ValidateImageOptions = {},
): ImageValidationResult {
  if (!files.length) {
    return { valid: false, message: "Please select at least one image." };
  }

  for (const file of files) {
    const result = validateImageFile(file, options);
    if (!result.valid) return result;
  }

  return { valid: true };
}
