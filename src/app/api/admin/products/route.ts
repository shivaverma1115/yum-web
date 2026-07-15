import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createProductWithSupabase,
  getImageFilesFromFormData,
  listProductsWithSupabase,
  parseProductFormData,
} from "@/lib/supabase/product/products";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? undefined;
    const categories = searchParams
      .get("categories")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const adminClient = createAdminClient();
    const result = await listProductsWithSupabase(adminClient, {
      page,
      limit,
      search,
      categories,
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
      context: "Admin List Products API",
      meta: { url: "/api/admin/products", method: "GET", status: 500 },
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

    const imageFiles = getImageFilesFromFormData(formData);
    const adminClient = createAdminClient();
    const result = await createProductWithSupabase(
      adminClient,
      input,
      imageFiles,
      auth.user.id,
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
      message: "Product created successfully.",
      data: { product: result.product },
    });
  } catch (error) {
    logError(error, {
      context: "Create Product API",
      meta: { url: "/api/products", method: "POST", status: 500 },
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
