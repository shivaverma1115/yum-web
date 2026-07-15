import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import type {
  IProductCategory,
  ProductCategoryInput,
} from "@/types/product-category";

const CATEGORY_COLUMNS =
  "id, name, slug, sort_order, is_active, created_at, updated_at";

export type ListProductCategoriesResult =
  | { success: true; categories: IProductCategory[] }
  | { success: false; message: string; status: number };

export type ProductCategoryMutationResult =
  | { success: true; category: IProductCategory }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function listProductCategoriesWithSupabase(
  supabase: SupabaseClient,
  options: {
    includeInactive?: boolean;
    /** Only categories that have at least one available product. */
    onlyWithProducts?: boolean;
  } = {},
): Promise<ListProductCategoriesResult> {
  let query = supabase
    .from("product_categories")
    .select(CATEGORY_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (!options.includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  let categories = (data ?? []) as IProductCategory[];

  if (options.onlyWithProducts) {
    const { data: productRows, error: productsError } = await supabase
      .from("products")
      .select("category")
      .eq("is_available", true);

    if (productsError) {
      return {
        success: false,
        message: productsError.message ?? ERROR_MESSAGE_GENERIC,
        status: 400,
      };
    }

    const usedKeys = new Set(
      (productRows ?? [])
        .map((row) => String(row.category ?? "").trim().toLowerCase())
        .filter(Boolean),
    );

    categories = categories.filter((category) => {
      const slug = category.slug.trim().toLowerCase();
      const name = category.name.trim().toLowerCase();
      return usedKeys.has(slug) || usedKeys.has(name);
    });
  }

  return {
    success: true,
    categories,
  };
}

export async function createProductCategoryWithSupabase(
  supabase: SupabaseClient,
  input: ProductCategoryInput,
): Promise<ProductCategoryMutationResult> {
  const name = input.name.trim();
  const slug = (input.slug.trim() || slugify(name)) || "";

  if (!name) {
    return {
      success: false,
      message: "Category name is required.",
      status: 400,
      errors: { name: "Category name is required." },
    };
  }

  if (!slug) {
    return {
      success: false,
      message: "Category slug is required.",
      status: 400,
      errors: { slug: "Category slug is required." },
    };
  }

  const { data, error } = await supabase
    .from("product_categories")
    .insert({
      name,
      slug,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active ?? true,
    })
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  return {
    success: true,
    category: data as IProductCategory,
  };
}

export async function updateProductCategoryWithSupabase(
  supabase: SupabaseClient,
  categoryId: string,
  input: Partial<ProductCategoryInput>,
): Promise<ProductCategoryMutationResult> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.slug !== undefined) payload.slug = input.slug.trim();
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order;
  if (input.is_active !== undefined) payload.is_active = input.is_active;

  const { data, error } = await supabase
    .from("product_categories")
    .update(payload)
    .eq("id", categoryId)
    .select(CATEGORY_COLUMNS)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  return {
    success: true,
    category: data as IProductCategory,
  };
}

export async function deleteProductCategoryWithSupabase(
  supabase: SupabaseClient,
  categoryId: string,
): Promise<
  | { success: true }
  | { success: false; message: string; status: number }
> {
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  return { success: true };
}
