import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createCustomerWithSupabase,
} from "@/lib/supabase/customers";
import { IUser } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as IUser & {
      password?: string;
    };

    if (!payload.password?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
          errors: { password: "Password is required." },
        },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const result = await createCustomerWithSupabase(adminClient, {
      ...payload,
      password: payload.password,
    });

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
      message: "Customer created successfully.",
      data: { user: result.user },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Create Customer API",
      meta: { url: "/api/admin/customers", method: "POST", status: 500 },
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
