// Approximate exchange rates: 1 unit of foreign currency in CHF.
// Used only for cross-currency aggregation in the UI — not suitable for financial decisions.
export const FX_TO_CHF: Record<string, number> = {
  CHF: 1.00,
  EUR: 1.05,
  USD: 0.90,
  GBP: 1.13,
  DKK: 0.14,
};

export function toCHF(amount: number, currency: string): number {
  return amount * (FX_TO_CHF[currency] ?? 1.0);
}
