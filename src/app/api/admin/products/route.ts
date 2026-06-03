import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createProductWithSupabase,
  getImageFilesFromFormData,
  parseProductFormData,
} from "@/lib/supabase/product/products";

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
