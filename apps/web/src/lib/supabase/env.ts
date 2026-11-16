import { z } from "zod";

const supabaseEnvSchema = z.object({
  url: z.url("NEXT_PUBLIC_SUPABASE_URL must be your project URL, e.g. https://xyz.supabase.co"),
  publishableKey: z.string().startsWith("sb_publishable_", "Invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
});

/** Validated public Supabase config. Safe to use on server and client. */
export function getSupabaseEnv() {
  const parsed = supabaseEnvSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!parsed.success) {
    throw new Error(
      `Supabase is not configured: ${parsed.error.issues.map((i) => i.message).join("; ")}. ` +
        "Set the values in apps/web/.env.local.",
    );
  }
  return parsed.data;
}

export function isSupabaseConfigured(): boolean {
  try {
    getSupabaseEnv();
    return true;
  } catch {
    return false;
  }
}
