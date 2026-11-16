import { describe, expect, it, vi } from "vitest";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

const VALID_URL = "https://abcd.supabase.co";
const VALID_KEY = "sb_publishable_test123";

function setEnv(url?: string, key?: string) {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", key);
}

describe("getSupabaseEnv", () => {
  it("returns validated config", () => {
    setEnv(VALID_URL, VALID_KEY);
    expect(getSupabaseEnv()).toEqual({ url: VALID_URL, publishableKey: VALID_KEY });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("rejects a missing or non-URL project URL", () => {
    setEnv(undefined, VALID_KEY);
    expect(() => getSupabaseEnv()).toThrow(/Supabase is not configured/);
    setEnv("sb_publishable_oops", VALID_KEY);
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("rejects a key that is not a publishable key", () => {
    setEnv(VALID_URL, "sb_secret_should_not_be_public");
    expect(() => getSupabaseEnv()).toThrow(/PUBLISHABLE_KEY/);
  });
});
