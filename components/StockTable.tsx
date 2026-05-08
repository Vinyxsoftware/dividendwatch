"use client";
import { useState } from "react";
import Link from "next/link";
import { SustainabilityBadge } from "./SustainabilityBadge";
import { ArrowUpDown, Globe } from "lucide-react";
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
  { value: "all", label: "Alle Regionen" },
  { value: "CH",  label: "Schweiz" },
  { value: "EU",  label: "Europa" },
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/8">
          {regions.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                region === r.value
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSort(sort === "dividendYield" ? "price" : "dividendYield")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sort === "dividendYield" ? "Nach Rendite" : "Nach Preis"}
        </button>

        <span className="ml-auto text-xs text-muted-foreground font-data">
          {filtered.length} Aktien
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.02]">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Ticker</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Kurs</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Div./Jahr</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rendite</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Payout</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Nachh.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-16 text-sm">
                  Keine Aktien gefunden.
                </td>
              </tr>
            )}
            {filtered.map((s, i) => (
              <tr
                key={s.id}
                className={`group border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors ${
                  i % 2 === 0 ? "" : "bg-white/[0.01]"
                }`}
              >
                <td className="px-4 py-3.5">
                  <Link
                    href={`/stock/${encodeURIComponent(s.ticker)}`}
                    className="font-data font-semibold text-sm text-primary hover:text-primary/80 transition-colors group-hover:underline underline-offset-2"
                  >
                    {s.ticker}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-sm text-foreground leading-tight">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />
                    {s.exchange} · {s.region}
                  </div>
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
