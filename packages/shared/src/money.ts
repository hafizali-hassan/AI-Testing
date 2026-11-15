/**
 * Money is always stored as integer cents (1 USD = 100 cents) to avoid floating point errors.
 */
export const CURRENCY = "USD" as const;

/** Basis points: 10000 = 100%. Platform commission is 15% of the invoice price. */
export const DEFAULT_COMMISSION_BPS = 1500;

const BPS_DENOMINATOR = 10_000;

export interface CommissionSplit {
  totalCents: number;
  commissionCents: number;
  technicianPayoutCents: number;
}

export function splitCommission(
  totalCents: number,
  commissionBps: number = DEFAULT_COMMISSION_BPS,
): CommissionSplit {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0) {
    throw new RangeError("totalCents must be a non-negative integer");
  }
  if (!Number.isInteger(commissionBps) || commissionBps < 0 || commissionBps > BPS_DENOMINATOR) {
    throw new RangeError("commissionBps must be an integer between 0 and 10000");
  }
  const commissionCents = Math.round((totalCents * commissionBps) / BPS_DENOMINATOR);
  return { totalCents, commissionCents, technicianPayoutCents: totalCents - commissionCents };
}

export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY }).format(
    cents / 100,
  );
}
