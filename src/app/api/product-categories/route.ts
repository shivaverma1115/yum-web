import { NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { listProductCategoriesWithSupabase } from "@/lib/supabase/product/categories";

/** Public product category list for storefront filters. */
export async function GET() {
  try {
    const adminClient = createAdminClient();
    const result = await listProductCategoriesWithSupabase(adminClient);

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
      context: "List Product Categories API",
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
