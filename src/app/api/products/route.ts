import { NextRequest, NextResponse } from "next/server";
import { listProductsWithSupabase } from "@/lib/supabase/product/products";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/utils/logError";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";

/** Public product catalog (paginated). */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? undefined;

    const adminClient = createAdminClient();
    const result = await listProductsWithSupabase(adminClient, {
      page,
      limit,
      search,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        products: result.products,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    logError(error, {
      context: "List Products API",
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
