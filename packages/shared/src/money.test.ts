import { describe, expect, it } from "vitest";
import { dollarsToCents, formatUSD, percentToBps, splitCommission } from "./money";

describe("splitCommission", () => {
  it("takes 15% of the invoice by default", () => {
    expect(splitCommission(10_000)).toEqual({
      totalCents: 10_000,
      commissionCents: 1_500,
      technicianPayoutCents: 8_500,
    });
  });

  it("always sums back to the total", () => {
    for (const total of [0, 1, 99, 333, 123_457]) {
      const s = splitCommission(total);
      expect(s.commissionCents + s.technicianPayoutCents).toBe(total);
    }
  });

  it("rejects invalid input", () => {
    expect(() => splitCommission(-1)).toThrow(RangeError);
    expect(() => splitCommission(1.5)).toThrow(RangeError);
    expect(() => splitCommission(100, 10_001)).toThrow(RangeError);
  });
});

describe("conversions", () => {
  it("converts percent, dollars and formats USD", () => {
    expect(percentToBps(15)).toBe(1500);
    expect(dollarsToCents(49.99)).toBe(4_999);
    expect(formatUSD(4_999)).toBe("$49.99");
  });
});
