import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";
import { getProfileByUserId } from "@/lib/supabase/profile";
import type { IUser } from "@/types/user";

export type MiddlewareSession = {
  response: NextResponse;
  user: { id: string; email?: string } | null;
  profile: IUser | null;
  supabase: SupabaseClient;
};

export async function updateSession(
  request: NextRequest,
): Promise<MiddlewareSession> {
  let response = NextResponse.next({ request });

  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value }) => {
        request.cookies.set(name, value);
      });
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfileByUserId(supabase, user.id) : null;

  return {
    response,
    user: user ? { id: user.id, email: user.email } : null,
    profile,
    supabase,
  };
}
