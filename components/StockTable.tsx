"use client";
import { useState } from "react";
import Link from "next/link";
import { SustainabilityBadge } from "./SustainabilityBadge";
import { ArrowUpDown } from "lucide-react";
import type { Stock } from "@/types/stock";
import { fmt, fmtPrice } from "@/lib/format";

function yieldColor(y: number | null) {
  if (y === null) return "text-muted-foreground";
  if (y >= 4) return "text-emerald-700";
  if (y >= 2) return "text-blue-600";
  return "text-muted-foreground";
}
function yieldBarColor(y: number | null) {
  if (y === null || y <= 0) return "bg-muted-foreground/20";
  if (y >= 4) return "bg-emerald-500";
  if (y >= 2) return "bg-blue-400";
  return "bg-muted-foreground/30";
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
      {/* Filter bar */}
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
          {sort === "dividendYield" ? "Sorted by Yield" : "Sorted by Price"}
        </button>
        <span className="ml-auto text-xs text-muted-foreground font-data">{filtered.length} stocks</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="bg-muted/60 px-3 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-10">#</th>
              <th className="bg-muted/60 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
              <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="bg-emerald-50 border-l-2 border-emerald-200 px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider hidden sm:table-cell">Div./Year</th>
              <th className="bg-emerald-50 px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Yield</th>
              <th className="bg-muted/60 border-l border-border px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Payout</th>
              <th className="bg-muted/60 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Sust.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-16 text-sm">No stocks found.</td>
              </tr>
            )}
            {filtered.map((s, i) => (
              <tr
                key={s.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
              >
                <td className="px-3 py-4 text-center">
                  <span className="font-data text-xs font-semibold text-muted-foreground/40">{i + 1}</span>
                </td>

                <td className="px-4 py-4">
                  <Link
                    href={`/stock/${encodeURIComponent(s.ticker)}`}
                    className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {s.name}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1">
                    <code className="font-data text-xs bg-muted border border-border/60 px-1.5 py-0.5 rounded text-muted-foreground">
                      {s.ticker}
                    </code>
                    <span className="text-xs text-muted-foreground/40">{s.exchange} · {s.region}</span>
                  </div>
                </td>

                <td className="px-4 py-4 text-right font-data text-sm font-medium text-foreground whitespace-nowrap">
                  {fmtPrice(s.currentPrice, s.currency)}
                </td>

                <td className="bg-emerald-50/40 group-hover:bg-emerald-50/60 border-l-2 border-emerald-100 px-4 py-4 text-right font-data text-sm text-muted-foreground hidden sm:table-cell transition-colors">
                  {s.annualDividend ? fmtPrice(s.annualDividend, s.currency) : "—"}
                </td>

                <td className="bg-emerald-50/40 group-hover:bg-emerald-50/60 px-4 py-4 transition-colors">
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`font-data font-bold text-sm ${yieldColor(s.dividendYield)}`}>
                      {s.dividendYield !== null ? `${s.dividendYield.toFixed(2)}%` : "—"}
                    </span>
                    <div className="w-16 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${yieldBarColor(s.dividendYield)}`}
                        style={{ width: `${Math.min(((s.dividendYield ?? 0) / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="border-l border-border/40 px-4 py-4 text-right font-data text-sm text-muted-foreground hidden md:table-cell">
                  {fmt(s.payoutRatio, 1, "%")}
                </td>

                <td className="px-4 py-4 hidden lg:table-cell">
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
