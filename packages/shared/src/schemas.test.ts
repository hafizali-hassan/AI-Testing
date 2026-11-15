import { describe, expect, it } from "vitest";
import { signUpSchema, toE164PK } from "./schemas";

describe("signUpSchema", () => {
  it("accepts name, email and Pakistani phone", () => {
    const r = signUpSchema.safeParse({ name: "Ali Hassan", email: "ali@example.com", phone: "03001234567" });
    expect(r.success).toBe(true);
    expect(r.data?.role).toBe("customer");
  });

  it("rejects bad phone and email", () => {
    expect(signUpSchema.safeParse({ name: "Ali", email: "nope", phone: "03001234567" }).success).toBe(false);
    expect(signUpSchema.safeParse({ name: "Ali", email: "a@b.co", phone: "12345" }).success).toBe(false);
  });
});

describe("toE164PK", () => {
  it("normalises local numbers", () => {
    expect(toE164PK("03001234567")).toBe("+923001234567");
    expect(toE164PK("+923001234567")).toBe("+923001234567");
  });
});
