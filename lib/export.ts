import type { Stock } from "@/types/stock";

const CSV_COLUMNS: { header: string; get: (s: Stock) => string | number }[] = [
  { header: "Ticker", get: (s) => s.ticker },
  { header: "Name", get: (s) => s.name },
  { header: "Price", get: (s) => s.currentPrice ?? "" },
  { header: "Currency", get: (s) => s.currency },
  { header: "Yield (%)", get: (s) => s.dividendYield ?? "" },
  { header: "Dividend / Share", get: (s) => s.annualDividend ?? "" },
  { header: "Payout Ratio (%)", get: (s) => s.payoutRatio ?? "" },
  { header: "Sector", get: (s) => s.sector ?? "" },
  { header: "Region", get: (s) => s.region ?? "" },
  { header: "Exchange", get: (s) => s.exchange },
];

function csvCell(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function stocksToCSV(stocks: Stock[]): string {
  const header = CSV_COLUMNS.map((c) => csvCell(c.header)).join(",");
  const rows = stocks.map((s) => CSV_COLUMNS.map((c) => csvCell(c.get(s))).join(","));
  return [header, ...rows].join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
