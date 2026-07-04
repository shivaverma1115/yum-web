import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";
import { getProfileByUserId } from "@/lib/supabase/account/profile";
import type { IUser } from "@/types/user";

export type MiddlewareSession = {
  response: NextResponse;
  user: User | null;
  profile: IUser | null;
  isAnonymous: boolean;
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
    user,
    profile,
    isAnonymous: user ? isAnonymousUser(user) : false,
    supabase,
  };
}
