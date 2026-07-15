import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteCustomerWithSupabase,
  forceDeleteCustomerWithSupabase,
  getCustomerByIdWithSupabase,
  updateCustomerWithSupabase,
} from "@/lib/supabase/customers";
import { IUser } from "@/types/user";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { userId } = await context.params;
    const adminClient = createAdminClient();
    const result = await getCustomerByIdWithSupabase(adminClient, userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: result.user },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Get Customer API",
      meta: {
        url: "/api/admin/customers/[userId]",
        method: "GET",
        status: 500,
      },
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { userId } = await context.params;
    const force = request.nextUrl.searchParams.get("force") === "true";

    // if (force && auth.profile.id === userId) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "You cannot force delete your own account.",
    //     },
    //     { status: 400 },
    //   );
    // }

    const adminClient = createAdminClient();
    const result = force
      ? await forceDeleteCustomerWithSupabase(adminClient, userId)
      : await deleteCustomerWithSupabase(adminClient, userId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          ...(result.associations
            ? { associations: result.associations }
            : {}),
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: force
        ? "Customer and all associated data deleted successfully."
        : "Customer deleted successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Admin Delete Customer API",
      meta: {
        url: "/api/admin/customers/[userId]",
        method: "DELETE",
        status: 500,
      },
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
