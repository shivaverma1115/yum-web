import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteProductWithSupabase,
  getProductWithSupabase,
  getImageFilesFromFormData,
  parseProductFormData,
  updateProductWithSupabase,
} from "@/lib/supabase/product/products";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

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
      context: "Get Product API",
      meta: { url: "/api/admin/products/[productId]", method: "GET", status: 500 },
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { productId } = await context.params;
    const formData = await request.formData();
    const { input, errors } = parseProductFormData(formData);

    if (!input) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fix the validation errors.",
          errors,
        },
        { status: 400 },
      );
    }

    const existingImageUrls = formData.get("image_urls");
    if (typeof existingImageUrls === "string" && existingImageUrls) {
      try {
        input.image_urls = JSON.parse(existingImageUrls) as string[];
        if (!input.image_url && input.image_urls[0]) {
          input.image_url = input.image_urls[0];
        }
      } catch {
        input.image_urls = [];
      }
    }

    const imageFiles = getImageFilesFromFormData(formData);
    const adminClient = createAdminClient();
    const result = await updateProductWithSupabase(
      adminClient,
      productId,
      input,
      imageFiles,
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
      message: "Product updated successfully.",
      data: { product: result.product },
    });
  } catch (error) {
    logError(error, {
      context: "Update Product API",
      meta: { url: "/api/products/[productId]", method: "PATCH", status: 500 },
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

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { productId } = await context.params;
    const adminClient = createAdminClient();
    const result = await deleteProductWithSupabase(adminClient, productId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Delete Product API",
      meta: { url: "/api/admin/products/[productId]", method: "DELETE", status: 500 },
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
