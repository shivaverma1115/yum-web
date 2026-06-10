import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCustomerByIdWithSupabase } from "@/lib/supabase/customers";
import {
  type CustomerOrdersFilter,
  listCustomerOrdersWithSupabase,
} from "@/lib/supabase/orders";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

const VALID_FILTERS: CustomerOrdersFilter[] = [
  "all",
  "paid",
  "failed",
  "cancelled",
];

function parseFilter(value: string | null): CustomerOrdersFilter {
  if (value && VALID_FILTERS.includes(value as CustomerOrdersFilter)) {
    return value as CustomerOrdersFilter;
  }
  return "all";
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { userId } = await context.params;
    const filter = parseFilter(
      request.nextUrl.searchParams.get("filter"),
    );
    const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? "10");

    const adminClient = createAdminClient();
    const customerResult = await getCustomerByIdWithSupabase(
      adminClient,
      userId,
    );

    if (!customerResult.success) {
      return NextResponse.json(
        { success: false, message: customerResult.message },
        { status: customerResult.status },
      );
    }

    const result = await listCustomerOrdersWithSupabase(adminClient, userId, {
      filter,
      customerEmail: customerResult.user.email ?? undefined,
      page,
      limit,
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
        orders: result.orders,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Customer Orders API",
      meta: {
        url: "/api/admin/customers/[userId]/orders",
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
