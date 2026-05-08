export function calcSustainability(payoutRatio: number | null, dividendGrowth3Y: number | null): "green" | "yellow" | "red" {
  if (payoutRatio === null) return "yellow";
  if (payoutRatio > 85) return "red";
  if (dividendGrowth3Y !== null && dividendGrowth3Y < 0) return "red";
  if (payoutRatio > 60 || dividendGrowth3Y === null || dividendGrowth3Y === 0) return "yellow";
  return "green";
}

export function calcAnnualDividend(budget: number, price: number, annualDividendPerShare: number) {
  const shares = Math.floor(budget / price);
  const annualIncome = shares * annualDividendPerShare;
  const monthlyIncome = annualIncome / 12;
  return { shares, annualIncome, monthlyIncome };
}

export function formatCHF(value: number): string {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", minimumFractionDigits: 2 }).format(value);
}

export function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}
