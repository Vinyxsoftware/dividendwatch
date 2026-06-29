export function fmt(v: number | null, decimals = 2, suffix = ""): string {
  if (v === null || v === undefined) return "—";
  return `${v.toFixed(decimals)}${suffix}`;
}

export function fmtPrice(price: number | null, currency: string): string {
  if (!price) return "—";
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function fmtCHF(v: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(v);
}

export function fmtCHFRound(v: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(v);
}

export function fmtMarketCap(mc: number | null): string {
  if (!mc) return "—";
  if (mc >= 1e12) return `${(mc / 1e12).toFixed(1)}T`;
  if (mc >= 1e9) return `${(mc / 1e9).toFixed(1)}B`;
  return `${(mc / 1e6).toFixed(0)}M`;
}
