"use client";
import { useState } from "react";
import Link from "next/link";
import { SustainabilityBadge } from "./SustainabilityBadge";
import { ArrowUpDown } from "lucide-react";
import type { Stock } from "@/types/stock";

function fmt(v: number | null, decimals = 2, suffix = "") {
  if (v === null) return "—";
  return `${v.toFixed(decimals)}${suffix}`;
}

function fmtPrice(price: number | null, currency: string) {
  if (price === null) return "—";
  return new Intl.NumberFormat("de-CH", {
    style: "currency", currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(price);
}

function yieldColor(y: number | null) {
  if (y === null) return "text-muted-foreground";
  if (y >= 4) return "text-emerald-400";
  if (y >= 2) return "text-sky-400";
  return "text-muted-foreground";
}

const regions = [
  { value: "all", label: "All" },
  { value: "CH",  label: "Switzerland" },
  { value: "EU",  label: "Europe" },
  { value: "US",  label: "USA" },
];

export function StockTable({ stocks }: { stocks: Stock[] }) {
  const [region, setRegion] = useState("all");
  const [sort, setSort]     = useState("dividendYield");

  const filtered = stocks
    .filter((s) => region === "all" || s.region === region)
    .sort((a, b) => {
      if (sort === "dividendYield") return (b.dividendYield ?? 0) - (a.dividendYield ?? 0);
      if (sort === "price") return (a.currentPrice ?? 9999) - (b.currentPrice ?? 9999);
      return 0;
    });

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
          {regions.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                region === r.value
                  ? "bg-card text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSort(sort === "dividendYield" ? "price" : "dividendYield")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sort === "dividendYield" ? "By Yield" : "By Price"}
        </button>

        <span className="ml-auto text-xs text-muted-foreground font-data">
          {filtered.length} stocks
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Ticker</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Div./Year</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Yield</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Payout</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Sust.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-16 text-sm">
                  No stocks found.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <Link
                    href={`/stock/${encodeURIComponent(s.ticker)}`}
                    className="font-data font-semibold text-sm text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    {s.ticker}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-sm text-foreground leading-tight">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.exchange} · {s.region}</div>
                </td>
                <td className="px-4 py-3.5 text-right font-data text-sm text-foreground">
                  {fmtPrice(s.currentPrice, s.currency)}
                </td>
                <td className="px-4 py-3.5 text-right font-data text-sm text-muted-foreground hidden sm:table-cell">
                  {s.annualDividend ? fmtPrice(s.annualDividend, s.currency) : "—"}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className={`font-data font-semibold text-sm ${yieldColor(s.dividendYield)}`}>
                    {s.dividendYield !== null ? `${s.dividendYield.toFixed(2)}%` : "—"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-data text-sm text-muted-foreground hidden md:table-cell">
                  {fmt(s.payoutRatio, 1, "%")}
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <SustainabilityBadge status={s.sustainabilityStatus as never} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
