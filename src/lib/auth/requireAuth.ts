import { getCurrentUser } from "@/lib/supabase/account/profile";
import { createClient } from "@/lib/supabase/server";

type RequireAuthOptions = {
  requireEmail?: boolean;
};

export async function requireAuth(options: RequireAuthOptions = {}) {
  const supabase = await createClient();
  const session = await getCurrentUser(supabase);

  if (!session) {
    return {
      authorized: false as const,
      status: 401,
      message: "You must be signed in.",
    };
  }

  if (options.requireEmail && !session.authUser.email) {
    return {
      authorized: false as const,
      status: 401,
      message: "You must be signed in to change your password.",
    };
  }

  return {
    authorized: true as const,
    supabase,
    user: session.authUser,
    profile: session.user,
  };
}
