import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductWithSupabase } from "@/lib/supabase/product/products";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

/** Public single product (by id). */
export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { productId } = await context.params;
    const adminClient = createAdminClient();
    const result = await getProductWithSupabase(adminClient, productId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
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
