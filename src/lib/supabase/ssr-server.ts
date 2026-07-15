import {
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/** Cookie adapter passed by server routes or middleware */
export type SupabaseCookieAdapter = {
  getAll: () => { name: string; value: string }[];
  setAll: (cookies: CookieToSet[]) => void;
};

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return { url, anonKey };
}

export function createSupabaseServerClient(
  cookies: SupabaseCookieAdapter,
): SupabaseClient {
  const { url, anonKey } = getSupabasePublicEnv();

  return createServerClient(url, anonKey, { cookies });
}
