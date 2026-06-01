import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  updateCustomerWithSupabase,
} from "@/lib/supabase/customers";
import { IUser } from "@/types/user";

type RouteContext = {
  params: Promise<{ userId: string }>;
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

    const { userId } = await context.params;
    const payload = (await request.json().catch(() => ({}))) as IUser;

    const adminClient = createAdminClient();
    const result = await updateCustomerWithSupabase(
      adminClient,
      userId,
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
      message: "Customer updated successfully.",
      data: { user: result.user },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Update Customer API",
      meta: { url: "/api/admin/customers/[userId]", method: "PATCH", status: 500 },
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
