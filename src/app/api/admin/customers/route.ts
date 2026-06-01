import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createCustomerWithSupabase,
  listCustomersWithSupabase,
} from "@/lib/supabase/customers";
import { UserRole, type IUser } from "@/types/user";

function parseRoleFilter(value: string | null): UserRole | undefined {
  if (value === UserRole.USER || value === UserRole.ADMIN) {
    return value;
  }
  return undefined;
}

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
    const role =
      parseRoleFilter(searchParams.get("role")) ?? UserRole.USER;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? undefined;

    const adminClient = createAdminClient();
    const result = await listCustomersWithSupabase(adminClient, {
      role,
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
        users: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Admin List Customers API",
      meta: { url: "/api/admin/customers", method: "GET", status: 500 },
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

    const payload = (await request.json().catch(() => ({}))) as IUser & {
      password?: string;
    };

    const adminClient = createAdminClient();
    const result = await createCustomerWithSupabase(adminClient, payload);

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
