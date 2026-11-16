/**
 * Domain layout: the marketing site lives on the root domain (bizniss.example)
 * and the product on the app subdomain (app.bizniss.example).
 */
export const DEV_APP_URL = "http://localhost:3000";
export const DEV_MARKETING_URL = "http://localhost:3001";

/** Join a base URL and a path, tolerating trailing/leading slashes. */
export function joinUrl(base: string, path = "/"): string {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/** Validate a configured base URL: absolute http(s), no path/query. Falls back in development. */
export function resolveBaseUrl(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Base URL must be http(s): ${value}`);
  }
  return url.origin;
}
