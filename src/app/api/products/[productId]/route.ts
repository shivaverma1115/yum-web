import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductBySlugOrIdWithSupabase } from "@/lib/supabase/product/products";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

/** Public single product (by slug or legacy id). */
export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { productId } = await context.params;
    const adminClient = createAdminClient();
    const result = await getProductBySlugOrIdWithSupabase(adminClient, productId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    if (!result.product.is_available) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { product: result.product },
    });
  } catch (error) {
    logError(error, {
      context: "Get Public Product API",
      meta: { url: "/api/products/[productId]", method: "GET", status: 500 },
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
