import type { SupabaseClient } from "@supabase/supabase-js";
import type { IProduct, ProductFormInput } from "@/types/product";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  deleteProductImagesByUrls,
  uploadProductImages,
} from "@/lib/supabase/product/product-images";

const PRODUCT_COLUMNS =
  "id, user_id, name, category, selling_price, cost_price, quantity, order_type, short_description, long_description, add_discount, add_expiry_date, return_policy, image_url, image_urls, created_at, updated_at";

export type CreateProductResult =
  | { success: true; product: IProduct }
  | { success: false; message: string; status: number; errors?: Record<string, string> };

export type UpdateProductResult = CreateProductResult;
export type DeleteProductResult =
  | { success: true }
  | { success: false; message: string; status: number };
export type ListProductsResult =
  | {
      success: true;
      products: IProduct[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  | { success: false; message: string; status: number };

export type ListProductsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  /** Product category slugs from product_categories.slug */
  categories?: string[];
};
export type GetProductResult =
  | { success: true; product: IProduct }
  | { success: false; message: string; status: number };

function parseBoolean(value: FormDataEntryValue | null): boolean {
  if (value === null) return false;
  const normalized = String(value).toLowerCase();
  return normalized === "true" || normalized === "on" || normalized === "1";
}

function parseNumber(
  value: FormDataEntryValue | null,
  field: string,
): { ok: true; value: number } | { ok: false; message: string } {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return { ok: false, message: `${field} must be a valid number.` };
  }
  return { ok: true, value: parsed };
}

export function parseProductFormData(formData: FormData): {
  input: ProductFormInput | null;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const order_type = String(formData.get("order_type") ?? "").trim();
  const short_description = String(formData.get("short_description") ?? "").trim();
  const long_description = String(formData.get("long_description") ?? "").trim();

  if (!name) errors.name = "Product name is required.";
  if (!category) errors.category = "Category is required.";
  if (!order_type) errors.order_type = "Order type is required.";
  if (!short_description) errors.short_description = "Short description is required.";
  if (!long_description) errors.long_description = "Long description is required.";

  const sellingPriceResult = parseNumber(formData.get("selling_price"), "Selling price");
  const costPriceResult = parseNumber(formData.get("cost_price"), "Cost price");
  const quantityResult = parseNumber(formData.get("quantity"), "Quantity");

  if (!sellingPriceResult.ok) errors.selling_price = sellingPriceResult.message;
  if (!costPriceResult.ok) errors.cost_price = costPriceResult.message;
  if (!quantityResult.ok) errors.quantity = quantityResult.message;

  if (sellingPriceResult.ok && sellingPriceResult.value < 0) {
    errors.selling_price = "Selling price cannot be negative.";
  }
  if (costPriceResult.ok && costPriceResult.value < 0) {
    errors.cost_price = "Cost price cannot be negative.";
  }
  if (quantityResult.ok && quantityResult.value < 0) {
    errors.quantity = "Quantity cannot be negative.";
  }

  if (Object.keys(errors).length > 0) {
    return { input: null, errors };
  }

  return {
    input: {
      name,
      category,
      selling_price: sellingPriceResult.ok ? sellingPriceResult.value : 0,
      cost_price: costPriceResult.ok ? costPriceResult.value : 0,
      quantity: quantityResult.ok ? quantityResult.value : 0,
      order_type,
      short_description,
      long_description,
      add_discount: parseBoolean(formData.get("add_discount")),
      add_expiry_date: parseBoolean(formData.get("add_expiry_date")),
      return_policy: parseBoolean(formData.get("return_policy")),
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      image_urls: [],
    },
    errors: {},
  };
}

export function getImageFilesFromFormData(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function createProductWithSupabase(
  supabase: SupabaseClient,
  input: ProductFormInput,
  imageFiles: File[],
  createdByUserId: string,
): Promise<CreateProductResult> {
  const { data: created, error: createError } = await supabase
    .from("products")
    .insert({
      user_id: createdByUserId,
      name: input.name,
      category: input.category,
      selling_price: input.selling_price,
      cost_price: input.cost_price,
      quantity: input.quantity,
      order_type: input.order_type,
      short_description: input.short_description,
      long_description: input.long_description,
      add_discount: input.add_discount,
      add_expiry_date: input.add_expiry_date,
      return_policy: input.return_policy,
      image_url: input.image_url,
      image_urls: input.image_urls,
    })
    .select(PRODUCT_COLUMNS)
    .single();

  if (createError || !created) {
    return {
      success: false,
      message: createError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  if (!imageFiles.length) {
    if (!input.image_url) {
      await supabase.from("products").delete().eq("id", created.id);
      return {
        success: false,
        message: "Please select at least one product image.",
        status: 400,
        errors: { image_url: "Please select at least one product image." },
      };
    }

    return { success: true, product: created as IProduct };
  }

  const uploadResult = await uploadProductImages(
    supabase,
    imageFiles,
    created.id,
  );

  if (!uploadResult.success) {
    await supabase.from("products").delete().eq("id", created.id);
    return {
      success: false,
      message: uploadResult.message,
      status: 400,
      errors: { image_url: uploadResult.message },
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update({
      image_url: uploadResult.image_url,
      image_urls: uploadResult.image_urls,
    })
    .eq("id", created.id)
    .select(PRODUCT_COLUMNS)
    .single();

  if (updateError || !updated) {
    await supabase.from("products").delete().eq("id", created.id);
    return {
      success: false,
      message: updateError?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true, product: updated as IProduct };
}

export async function updateProductWithSupabase(
  supabase: SupabaseClient,
  productId: string,
  input: ProductFormInput,
  imageFiles: File[],
): Promise<UpdateProductResult> {
  let image_url = input.image_url;
  let image_urls = input.image_urls;

  if (imageFiles.length) {
    const uploadResult = await uploadProductImages(
      supabase,
      imageFiles,
      productId,
    );

    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.message,
        status: 400,
        errors: { image_url: uploadResult.message },
      };
    }

    image_url = uploadResult.image_url;
    image_urls = uploadResult.image_urls;
  }

  if (!image_url) {
    return {
      success: false,
      message: "Please select at least one product image.",
      status: 400,
      errors: { image_url: "Please select at least one product image." },
    };
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      category: input.category,
      selling_price: input.selling_price,
      cost_price: input.cost_price,
      quantity: input.quantity,
      order_type: input.order_type,
      short_description: input.short_description,
      long_description: input.long_description,
      add_discount: input.add_discount,
      add_expiry_date: input.add_expiry_date,
      return_policy: input.return_policy,
      image_url,
      image_urls,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select(PRODUCT_COLUMNS)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true, product: data as IProduct };
}

export async function deleteProductWithSupabase(
  supabase: SupabaseClient,
  productId: string,
): Promise<DeleteProductResult> {
  const { data: existing, error: readError } = await supabase
    .from("products")
    .select("image_url, image_urls")
    .eq("id", productId)
    .single();

  if (readError || !existing) {
    return {
      success: false,
      message: readError?.message ?? "Product not found.",
      status: 404,
    };
  }

  const imageUrls = [
    ...(existing.image_url ? [existing.image_url] : []),
    ...((existing.image_urls ?? []) as string[]),
  ];

  const deleteImagesResult = await deleteProductImagesByUrls(supabase, imageUrls);
  if (!deleteImagesResult.success) {
    return {
      success: false,
      message: deleteImagesResult.message,
      status: 400,
    };
  }

  const { error: deleteProductError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteProductError) {
    return {
      success: false,
      message: deleteProductError.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true };
}

export async function listProductsWithSupabase(
  supabase: SupabaseClient,
  options: ListProductsOptions = {},
): Promise<ListProductsResult> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 10));
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false });

  const search = options.search?.trim();
  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `name.ilike.${pattern},category.ilike.${pattern},short_description.ilike.${pattern}`,
    );
  }

  const categories = options.categories?.map((slug) => slug.trim()).filter(Boolean);
  if (categories?.length) {
    query = query.in("category", categories);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  const total = count ?? 0;

  return {
    success: true,
    products: (data ?? []) as IProduct[],
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProductWithSupabase(
  supabase: SupabaseClient,
  productId: string,
): Promise<GetProductResult> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", productId)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Product not found.",
      status: 404,
    };
  }

  return {
    success: true,
    product: data as IProduct,
  };
}
