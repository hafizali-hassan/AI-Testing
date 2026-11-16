import { DEV_APP_URL, joinUrl, resolveBaseUrl } from "@bizniss/shared";

/** Absolute URL into the product on the app subdomain (e.g. https://app.bizniss.pk/signin). */
export function appUrl(path = "/"): string {
  return joinUrl(resolveBaseUrl(process.env.NEXT_PUBLIC_APP_URL, DEV_APP_URL), path);
}
