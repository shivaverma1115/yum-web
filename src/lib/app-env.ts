/**
 * App deployment target from .env — independent of Next's NODE_ENV.
 * `next dev` always forces NODE_ENV=development; use NEXT_PUBLIC_APP_ENV
 * to mark which backend / dataset you are pointed at.
 */
export type AppEnv = "development" | "staging" | "production";

export function getAppEnv(): AppEnv {
  const raw = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
  if (raw === "production" || raw === "staging" || raw === "development") {
    return raw;
  }
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function isProductionAppEnv(): boolean {
  return getAppEnv() === "production";
}

/** Amber banner for non-production datasets (works under `next dev`). */
export function shouldShowDevModeBanner(): boolean {
  return !isProductionAppEnv();
}
