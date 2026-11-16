import { DEV_MARKETING_URL, joinUrl, resolveBaseUrl } from "@bizniss/shared";

/** Absolute URL on the marketing site (root domain, e.g. https://bizniss.pk/). */
export function marketingUrl(path = "/"): string {
  return joinUrl(resolveBaseUrl(process.env.NEXT_PUBLIC_MARKETING_URL, DEV_MARKETING_URL), path);
}
