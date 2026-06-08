import { NextResponse, type NextRequest } from "next/server";
import { getDefaultPathForRole } from "@/lib/auth/redirect";
import { updateSession } from "@/lib/supabase/middleware";
import { UserRole } from "@/types/user";

/** (auth) route group — URLs omit the group name */
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/recover-password",
  "/reset-password",
] as const;

/** (storefront) route group */
const STOREFRONT_ROUTES = [
  "/",
  "/home",
  "/cart",
  "/checkout",
  "/contact",
  "/faqs",
  "/wishlist",
  "/products",
] as const;

const LOGIN_PATH = "/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    isApiRoute(pathname) ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/confirm")
  ) {
    return NextResponse.next();
  }

  const { response: sessionResponse, user, profile } =
    await updateSession(request);

  const role = profile?.role ?? UserRole.USER;

  if (user && isAuthRoute(pathname) && pathname !== "/reset-password") {
    return redirectWithCookies(
      new URL(getDefaultPathForRole(role), request.url),
      sessionResponse,
    );
  }

  if (isPublicRoute(pathname)) {
    return sessionResponse;
  }

  if (!user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (pathname !== LOGIN_PATH) {
      loginUrl.searchParams.set("redirectTo", pathname);
    }
    return redirectWithCookies(loginUrl, sessionResponse);
  }

  if (role === UserRole.USER && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    return redirectWithCookies(new URL("/", request.url), sessionResponse);
  }

  // if (role === UserRole.ADMIN && pathname === "/") {
  //   return redirectWithCookies(
  //     new URL(getDefaultPathForRole(role), request.url),
  //     sessionResponse,
  //   );
  // }

  return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRoute(pathname: string) {
  return matchesRoute(pathname, AUTH_ROUTES);
}

function isStorefrontRoute(pathname: string) {
  return matchesRoute(pathname, STOREFRONT_ROUTES);
}

/** Guests may only access auth + storefront pages */
function isPublicRoute(pathname: string) {
  return isAuthRoute(pathname) || isStorefrontRoute(pathname);
}

function isApiRoute(pathname: string) {
  return pathname.startsWith("/api/");
}

function redirectWithCookies(
  url: URL,
  sessionResponse: NextResponse,
) {
  const redirectResponse = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}