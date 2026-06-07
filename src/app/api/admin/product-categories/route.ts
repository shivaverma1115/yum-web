import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createProductCategoryWithSupabase,
  listProductCategoriesWithSupabase,
} from "@/lib/supabase/product/categories";
import type { ProductCategoryInput } from "@/types/product-category";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const adminClient = createAdminClient();
    const result = await listProductCategoriesWithSupabase(adminClient, {
      includeInactive: true,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { categories: result.categories },
    });
  } catch (error) {
    logError(error, {
      context: "Admin List Product Categories API",
      meta: { method: "GET", status: 500 },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as ProductCategoryInput;
    const adminClient = createAdminClient();
    const result = await createProductCategoryWithSupabase(adminClient, payload);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors ?? {},
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category created successfully.",
      data: { category: result.category },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Create Product Category API",
      meta: { method: "POST", status: 500 },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}
