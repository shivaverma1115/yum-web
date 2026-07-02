import { getUserDisplayName } from "@/lib/user/display-name";
import { UserRole, type IUser } from "@/types/user";

export type CheckoutSessionUser = {
  id: string;
  role: UserRole;
  email: string | null;
  phone: string;
  displayName: string;
  isAnonymous: boolean;
};

type AnonymousAuthSuccess = {
  success: true;
  data: {
    user: IUser;
    is_anonymous?: boolean;
  };
};

/**
 * Ensures the browser has an authenticated session before placing an order.
 * Creates an anonymous Supabase user on the server only when needed.
 */
export async function ensureCheckoutSession(): Promise<CheckoutSessionUser> {
  const response = await fetch("/api/auth/anonymous", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as
    | AnonymousAuthSuccess
    | { success: false; message?: string };

  if (!response.ok || !data.success) {
    throw new Error(
      ("message" in data && data.message) ||
        "Could not start checkout. Please try again.",
    );
  }

  const profile = data.data.user;

  if (!profile.id) {
    throw new Error("Checkout session is missing a user id.");
  }

  return {
    id: profile.id,
    role: profile.role ?? UserRole.USER,
    email: profile.email,
    phone: profile.phone ?? "",
    displayName: getUserDisplayName(profile),
    isAnonymous: Boolean(data.data.is_anonymous),
  };
}
