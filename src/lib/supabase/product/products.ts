import type { SupabaseClient } from "@supabase/supabase-js";
import type { IProduct, ProductFormInput } from "@/types/product";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  isProductDietType,
  normalizeAllergens,
  normalizeIngredients,
  normalizeSpiceLevels,
  parseStringArrayFromFormData,
} from "@/lib/products/attributes";
import {
  normalizeOrderTypes,
  parseOrderTypesFromFormData,
} from "@/lib/order-types";
import { isRichTextEmpty } from "@/lib/rich-text";
import {
  deleteProductImagesByUrls,
  uploadProductImages,
} from "@/lib/supabase/product/product-images";
import {
  isProductUuid,
  slugifyProductName,
} from "@/lib/products/slug";

const PRODUCT_COLUMNS =
  "id, user_id, slug, name, category, selling_price, quantity, order_type, short_description, long_description, add_discount, discount_percent, preparation_time_minutes, diet_type, spice_levels, ingredients, allergens, is_available, image_url, image_urls, created_at, updated_at";

async function resolveUniqueProductSlug(
  supabase: SupabaseClient,
  name: string,
  excludeProductId?: string,
): Promise<string> {
  const baseSlug = slugifyProductName(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabase.from("products").select("id").eq("slug", candidate);

    if (excludeProductId) {
      query = query.neq("id", excludeProductId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

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
  /** When true, only products marked available (storefront catalog). */
  availableOnly?: boolean;
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

function mapProductRow(row: Record<string, unknown>): IProduct {
  return {
    ...(row as IProduct),
    order_type: normalizeOrderTypes(row.order_type),
    spice_levels: normalizeSpiceLevels(row.spice_levels),
    ingredients: normalizeIngredients(row.ingredients),
    allergens: normalizeAllergens(row.allergens),
    is_available: row.is_available !== false,
  };
}

export function parseProductFormData(formData: FormData): {
  input: ProductFormInput | null;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const order_type = parseOrderTypesFromFormData(formData);
  const short_description = String(formData.get("short_description") ?? "").trim();
  const long_description = String(formData.get("long_description") ?? "").trim();

  if (!name) errors.name = "Product name is required.";
  if (!category) errors.category = "Category is required.";
  if (!order_type.length) {
    errors.order_type = "Select at least one order type.";
  }
  if (isRichTextEmpty(short_description)) {
    errors.short_description = "Short description is required.";
  }
  if (isRichTextEmpty(long_description)) {
    errors.long_description = "Long description is required.";
  }

  const sellingPriceResult = parseNumber(formData.get("selling_price"), "Selling price");
  const quantityResult = parseNumber(formData.get("quantity"), "Quantity");

  if (!sellingPriceResult.ok) errors.selling_price = sellingPriceResult.message;
  if (!quantityResult.ok) errors.quantity = quantityResult.message;

  if (sellingPriceResult.ok && sellingPriceResult.value < 0) {
    errors.selling_price = "Selling price cannot be negative.";
  }
  if (quantityResult.ok && quantityResult.value < 0) {
    errors.quantity = "Quantity cannot be negative.";
  }

  const add_discount = parseBoolean(formData.get("add_discount"));

  let discount_percent: number | null = null;
  if (add_discount) {
    const discountResult = parseNumber(
      formData.get("discount_percent"),
      "Discount percentage",
    );
    if (!discountResult.ok) {
      errors.discount_percent = discountResult.message;
    } else if (discountResult.value <= 0 || discountResult.value > 100) {
      errors.discount_percent = "Enter a discount between 1 and 100.";
    } else {
      discount_percent = discountResult.value;
    }
  }

  const preparationTimeRaw = String(
    formData.get("preparation_time_minutes") ?? "",
  ).trim();
  let preparation_time_minutes: number | null = null;
  if (preparationTimeRaw) {
    const preparationResult = parseNumber(
      preparationTimeRaw,
      "Preparation time",
    );
    if (!preparationResult.ok) {
      errors.preparation_time_minutes = preparationResult.message;
    } else if (preparationResult.value < 0) {
      errors.preparation_time_minutes = "Preparation time cannot be negative.";
    } else if (!Number.isInteger(preparationResult.value)) {
      errors.preparation_time_minutes = "Enter whole minutes only.";
    } else {
      preparation_time_minutes = preparationResult.value;
    }
  }

  const dietTypeRaw = String(formData.get("diet_type") ?? "").trim();
  const diet_type = isProductDietType(dietTypeRaw) ? dietTypeRaw : null;
  if (!diet_type) {
    errors.diet_type = "Please select Veg or Non Veg.";
  }

  const spice_levels = normalizeSpiceLevels(
    parseStringArrayFromFormData(formData, "spice_levels"),
  );
  const ingredients = normalizeIngredients(
    parseStringArrayFromFormData(formData, "ingredients"),
  );
  const allergens = normalizeAllergens(
    parseStringArrayFromFormData(formData, "allergens"),
  );
  const is_available = parseBoolean(formData.get("is_available"));

  if (Object.keys(errors).length > 0) {
    return { input: null, errors };
  }

  return {
    input: {
      name,
      category,
      selling_price: sellingPriceResult.ok ? sellingPriceResult.value : 0,
      quantity: quantityResult.ok ? quantityResult.value : 0,
      order_type,
      short_description,
      long_description,
      add_discount,
      discount_percent,
      preparation_time_minutes,
      diet_type,
      spice_levels,
      ingredients,
      allergens,
      is_available,
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
  let slug: string;
  try {
    slug = await resolveUniqueProductSlug(supabase, input.name);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  const { data: created, error: createError } = await supabase
    .from("products")
    .insert({
      user_id: createdByUserId,
      slug,
      name: input.name,
      category: input.category,
      selling_price: input.selling_price,
      quantity: input.quantity,
      order_type: input.order_type,
      short_description: input.short_description,
      long_description: input.long_description,
      add_discount: input.add_discount,
      discount_percent: input.add_discount ? input.discount_percent : null,
      preparation_time_minutes: input.preparation_time_minutes,
      diet_type: input.diet_type,
      spice_levels: input.spice_levels,
      ingredients: input.ingredients,
      allergens: input.allergens,
      is_available: input.is_available,
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

    return { success: true, product: mapProductRow(created) };
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

  return { success: true, product: mapProductRow(updated) };
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

    image_urls = [...input.image_urls, ...uploadResult.image_urls];
    image_url = image_urls[0] ?? uploadResult.image_url;
  }

  if (!image_url) {
    return {
      success: false,
      message: "Please select at least one product image.",
      status: 400,
      errors: { image_url: "Please select at least one product image." },
    };
  }

  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("name, slug")
    .eq("id", productId)
    .maybeSingle();

  if (existingError || !existing) {
    return {
      success: false,
      message: existingError?.message ?? "Product not found.",
      status: 404,
    };
  }

  let slug = existing.slug;
  if (existing.name.trim() !== input.name.trim()) {
    try {
      slug = await resolveUniqueProductSlug(supabase, input.name, productId);
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
        status: 400,
      };
    }
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      slug,
      name: input.name,
      category: input.category,
      selling_price: input.selling_price,
      quantity: input.quantity,
      order_type: input.order_type,
      short_description: input.short_description,
      long_description: input.long_description,
      add_discount: input.add_discount,
      discount_percent: input.add_discount ? input.discount_percent : null,
      preparation_time_minutes: input.preparation_time_minutes,
      diet_type: input.diet_type,
      spice_levels: input.spice_levels,
      ingredients: input.ingredients,
      allergens: input.allergens,
      is_available: input.is_available,
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

  return { success: true, product: mapProductRow(data) };
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

  if (options.availableOnly) {
    query = query.eq("is_available", true);
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
    products: (data ?? []).map((row) => mapProductRow(row as Record<string, unknown>)),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export type SitemapProductEntry = {
  slug: string;
  updated_at?: string;
};

export async function listSitemapProductsWithSupabase(
  supabase: SupabaseClient,
): Promise<SitemapProductEntry[]> {
  const { data, error } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_available", true)
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).flatMap((row) =>
    row.slug ? [{ slug: row.slug, updated_at: row.updated_at }] : [],
  );
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
    product: mapProductRow(data),
  };
}

export async function getProductBySlugWithSupabase(
  supabase: SupabaseClient,
  slug: string,
): Promise<GetProductResult> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug.trim())
    .maybeSingle();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Product not found.",
      status: 404,
    };
  }

  return {
    success: true,
    product: mapProductRow(data),
  };
}

/** Resolve a storefront route param (slug or legacy UUID). */
export async function getProductBySlugOrIdWithSupabase(
  supabase: SupabaseClient,
  param: string,
): Promise<GetProductResult> {
  const value = param.trim();
  if (!value) {
    return {
      success: false,
      message: "Product not found.",
      status: 404,
    };
  }

  if (isProductUuid(value)) {
    return getProductWithSupabase(supabase, value);
  }

  return getProductBySlugWithSupabase(supabase, value);
}

export async function listRelatedProductsWithSupabase(
  supabase: SupabaseClient,
  excludeProductId: string,
  limit = 4,
): Promise<IProduct[]> {
  const result = await listProductsWithSupabase(supabase, {
    page: 1,
    limit: Math.max(limit + 1, 8),
    availableOnly: true,
  });

  if (!result.success) {
    return [];
  }

  return result.products
    .filter((product) => product.id !== excludeProductId)
    .slice(0, limit);
}
