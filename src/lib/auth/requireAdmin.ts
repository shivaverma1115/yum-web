import { UserRole } from "@/types/user";
import { getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const session = await getCurrentUser(supabase);

  if (!session) {
    return {
      authorized: false as const,
      status: 401,
      message: "You must be signed in.",
    };
  }

  if (session.user?.role !== UserRole.ADMIN || !session.user) {
    return {
      authorized: false as const,
      status: 403,
      message: "You do not have permission to perform this action.",
    };
  }

  return {
    authorized: true as const,
    supabase,
    user: session.authUser,
    profile: session.user,
  };
}
