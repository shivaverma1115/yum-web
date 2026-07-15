import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteProductCategoryWithSupabase,
  updateProductCategoryWithSupabase,
} from "@/lib/supabase/product/categories";
import type { ProductCategoryInput } from "@/types/product-category";

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { categoryId } = await context.params;
    const payload = (await request.json().catch(() => ({}))) as Partial<ProductCategoryInput>;
    const adminClient = createAdminClient();
    const result = await updateProductCategoryWithSupabase(
      adminClient,
      categoryId,
      payload,
    );

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
      message: "Category updated successfully.",
      data: { category: result.category },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Update Product Category API",
      meta: { method: "PATCH", status: 500 },
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

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { categoryId } = await context.params;
    const adminClient = createAdminClient();
    const result = await deleteProductCategoryWithSupabase(
      adminClient,
      categoryId,
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Admin Delete Product Category API",
      meta: { method: "DELETE", status: 500 },
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
