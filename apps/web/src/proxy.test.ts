import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getClaims = vi.fn();
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ auth: { getClaims } })),
}));

const { proxy } = await import("./proxy");

function req(path: string) {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

function configure() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abcd.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
}

beforeEach(() => {
  getClaims.mockResolvedValue({ data: null });
});

describe("proxy", () => {
  it("passes through when Supabase is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const res = await proxy(req("/account"));
    expect(res.headers.get("location")).toBeNull();
    expect(getClaims).not.toHaveBeenCalled();
  });

  it("redirects signed-out users away from /account", async () => {
    configure();
    const res = await proxy(req("/account?tab=1"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/signin");
  });

  it("lets signed-in users reach /account", async () => {
    configure();
    getClaims.mockResolvedValue({ data: { claims: { sub: "user-1" } } });
    const res = await proxy(req("/account"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("does not guard public pages", async () => {
    configure();
    const res = await proxy(req("/signup"));
    expect(res.headers.get("location")).toBeNull();
  });
});
