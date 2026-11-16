import { describe, expect, it } from "vitest";
import { joinUrl, resolveBaseUrl } from "./urls";

describe("joinUrl", () => {
  it("joins with exactly one slash", () => {
    expect(joinUrl("https://app.bizniss.pk/", "/signin")).toBe("https://app.bizniss.pk/signin");
    expect(joinUrl("https://app.bizniss.pk", "signin")).toBe("https://app.bizniss.pk/signin");
    expect(joinUrl("https://app.bizniss.pk")).toBe("https://app.bizniss.pk/");
  });

  it("keeps query strings in the path", () => {
    expect(joinUrl("http://localhost:3000", "/businesses?category=doctor")).toBe(
      "http://localhost:3000/businesses?category=doctor",
    );
  });
});

describe("resolveBaseUrl", () => {
  it("uses the fallback when unset", () => {
    expect(resolveBaseUrl(undefined, "http://localhost:3000")).toBe("http://localhost:3000");
    expect(resolveBaseUrl("", "http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("normalises to the origin", () => {
    expect(resolveBaseUrl("https://app.bizniss.pk/some/path?x=1", "x")).toBe("https://app.bizniss.pk");
  });

  it("rejects non-http URLs and garbage", () => {
    expect(() => resolveBaseUrl("javascript:alert(1)", "x")).toThrow();
    expect(() => resolveBaseUrl("not a url", "x")).toThrow();
  });
});
