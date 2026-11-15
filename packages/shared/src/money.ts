/**
 * Money is always stored as integer paisa (1 PKR = 100 paisa) to avoid floating point errors.
 */
export const CURRENCY = "PKR" as const;

/** Basis points: 10000 = 100%. */
export const DEFAULT_COMMISSION_BPS = 1000; // 10%

const BPS_DENOMINATOR = 10_000;

export interface CommissionSplit {
  totalPaisa: number;
  commissionPaisa: number;
  providerPayoutPaisa: number;
}

export function splitCommission(
  totalPaisa: number,
  commissionBps: number = DEFAULT_COMMISSION_BPS,
): CommissionSplit {
  if (!Number.isSafeInteger(totalPaisa) || totalPaisa < 0) {
    throw new RangeError("totalPaisa must be a non-negative integer");
  }
  if (!Number.isInteger(commissionBps) || commissionBps < 0 || commissionBps > BPS_DENOMINATOR) {
    throw new RangeError("commissionBps must be an integer between 0 and 10000");
  }
  const commissionPaisa = Math.round((totalPaisa * commissionBps) / BPS_DENOMINATOR);
  return { totalPaisa, commissionPaisa, providerPayoutPaisa: totalPaisa - commissionPaisa };
}

export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}

export function rupeesToPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatPKR(paisa: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(paisa / 100);
}
