import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";

/** Supabase client for Server Components, Server Actions, and Route Handlers */
export async function createClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options),
      );
    },
  });
}
