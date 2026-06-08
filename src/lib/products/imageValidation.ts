import {
  type ImageValidationResult,
  validateImageFile,
  validateImageFiles,
} from "@/lib/images/validation";

export type { ImageValidationResult };

export function validateProductImageFile(file: File): ImageValidationResult {
  return validateImageFile(file);
}

export function validateProductImageFiles(files: File[]): ImageValidationResult {
  const result = validateImageFiles(files);
  if (!result.valid && result.message === "Please select at least one image.") {
    return { valid: false, message: "Please select at least one product image." };
  }
  return result;
}
