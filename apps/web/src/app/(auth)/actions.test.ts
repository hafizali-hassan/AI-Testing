import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = {
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
  signOut: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({ auth })),
}));

class RedirectError extends Error {
  constructor(public url: string) {
    super(`REDIRECT ${url}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url);
  }),
}));

const { signIn, signOut, signUp, verifyCode } = await import("./actions");

function form(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

async function expectRedirect(p: Promise<unknown>, url: string) {
  await expect(p).rejects.toMatchObject({ url });
}

beforeEach(() => {
  auth.signInWithOtp.mockResolvedValue({ error: null });
  auth.verifyOtp.mockResolvedValue({ error: null });
  auth.signOut.mockResolvedValue({ error: null });
});

describe("signUp", () => {
  const valid = { name: "Ali Hassan", email: "ali@example.com", phone: "03001234567", role: "technician" };

  it("returns field errors and keeps values for invalid input", async () => {
    const res = await signUp({}, form({ name: "A", email: "bad", phone: "123", role: "customer" }));
    expect(res.fieldErrors?.name).toBeDefined();
    expect(res.fieldErrors?.email).toBeDefined();
    expect(res.fieldErrors?.phone).toBeDefined();
    expect(res.values?.email).toBe("bad");
    expect(auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it("rejects self-assigned admin role", async () => {
    const res = await signUp({}, form({ ...valid, role: "admin" }));
    expect(res.fieldErrors?.role).toBeDefined();
    expect(auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it("sends a code with normalised phone and redirects to verify", async () => {
    await expectRedirect(signUp({}, form(valid)), "/verify?email=ali%40example.com");
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: "ali@example.com",
      options: {
        shouldCreateUser: true,
        data: { name: "Ali Hassan", phone: "+923001234567", role: "technician" },
      },
    });
  });

  it("shows a generic error when Supabase fails", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: { status: 500, message: "boom" } });
    const res = await signUp({}, form(valid));
    expect(res.error).toMatch(/couldn't send a code/);
  });
});

describe("signIn", () => {
  it("validates email", async () => {
    const res = await signIn({}, form({ email: "nope" }));
    expect(res.fieldErrors?.email).toBeDefined();
  });

  it("does not create users and redirects to verify", async () => {
    await expectRedirect(signIn({}, form({ email: "a@b.co" })), "/verify?email=a%40b.co");
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: "a@b.co",
      options: { shouldCreateUser: false },
    });
  });

  it("does not reveal whether the account exists", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: { status: 422, message: "Signups not allowed" } });
    await expectRedirect(signIn({}, form({ email: "ghost@b.co" })), "/verify?email=ghost%40b.co");
  });

  it("shows a generic error on service failure", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: { status: 503, message: "down" } });
    const res = await signIn({}, form({ email: "a@b.co" }));
    expect(res.error).toMatch(/couldn't send a code/);
  });
});

describe("verifyCode", () => {
  it("requires a 6-digit code", async () => {
    const res = await verifyCode({}, form({ email: "a@b.co", token: "12ab" }));
    expect(res.fieldErrors?.token).toBeDefined();
    expect(auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("verifies and redirects to account", async () => {
    await expectRedirect(verifyCode({}, form({ email: "a@b.co", token: "123456" })), "/account");
    expect(auth.verifyOtp).toHaveBeenCalledWith({ email: "a@b.co", token: "123456", type: "email" });
  });

  it("shows an error for a wrong or expired code", async () => {
    auth.verifyOtp.mockResolvedValue({ error: { status: 403, message: "expired" } });
    const res = await verifyCode({}, form({ email: "a@b.co", token: "123456" }));
    expect(res.error).toMatch(/invalid or has expired/);
  });
});

describe("signOut", () => {
  it("signs out and goes home", async () => {
    await expectRedirect(signOut(), "/");
    expect(auth.signOut).toHaveBeenCalled();
  });
});
