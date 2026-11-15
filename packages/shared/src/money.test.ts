import { describe, expect, it } from "vitest";
import { percentToBps, rupeesToPaisa, splitCommission } from "./money";

describe("splitCommission", () => {
  it("takes 10% by default", () => {
    expect(splitCommission(250_000)).toEqual({
      totalPaisa: 250_000,
      commissionPaisa: 25_000,
      providerPayoutPaisa: 225_000,
    });
  });

  it("always sums back to the total", () => {
    for (const total of [0, 1, 99, 333, 123_457]) {
      const s = splitCommission(total, 1000);
      expect(s.commissionPaisa + s.providerPayoutPaisa).toBe(total);
    }
  });

  it("rejects invalid input", () => {
    expect(() => splitCommission(-1)).toThrow(RangeError);
    expect(() => splitCommission(1.5)).toThrow(RangeError);
    expect(() => splitCommission(100, 10_001)).toThrow(RangeError);
  });
});

describe("conversions", () => {
  it("converts percent and rupees", () => {
    expect(percentToBps(10)).toBe(1000);
    expect(rupeesToPaisa(1500)).toBe(150_000);
  });
});
