"use client";
import { useState } from "react";
import type { Stock } from "@/types/stock";
import { fmtCHF } from "@/lib/format";

// Approximate exchange rates: 1 unit of foreign currency in CHF.
// Used only for share-count estimation — not suitable for financial decisions.
const FX_TO_CHF: Record<string, number> = {
  CHF: 1.00,
  EUR: 1.05,
  USD: 0.90,
  GBP: 1.13,
  DKK: 0.14,
};

function toCHF(amount: number, currency: string): number {
  return amount * (FX_TO_CHF[currency] ?? 1.0);
}

export function BudgetCalculator({ stocks }: { stocks: Stock[] }) {
  const [budget, setBudget] = useState("500");
  const [ticker, setTicker] = useState("");

  const validStocks = stocks.filter((s) => s.currentPrice && s.annualDividend);
  const selected = validStocks.find((s) => s.ticker === ticker) ?? validStocks[0];

  const budgetNum = parseFloat(budget) || 0;
  const currency = selected?.currency ?? "USD";
  const priceInCHF = selected ? toCHF(selected.currentPrice ?? 0, currency) : 0;
  const shares = priceInCHF > 0 ? Math.floor(budgetNum / priceInCHF) : 0;
  const divInCHF = selected ? toCHF(selected.annualDividend ?? 0, currency) : 0;
  const annual = shares * divInCHF;
  const monthly = annual / 12;
  const remaining = budgetNum - shares * priceInCHF;

  const results = [
    { label: "Shares you can buy",  value: shares.toString(),  highlight: false },
    { label: "Annual dividend",     value: fmtCHF(annual),     highlight: true  },
    { label: "Monthly dividend",    value: fmtCHF(monthly),    highlight: true  },
    { label: "Cash remaining",      value: fmtCHF(remaining),  highlight: false },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Budget Calculator</h2>
        <p className="text-xs text-muted-foreground mt-0.5">How much dividend income does your budget buy?</p>
      </div>

      <div className="p-5 grid sm:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Budget (CHF)</label>
            <input
              type="number"
              min={0}
              max={100000}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground font-data text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Stock</label>
            <select
              value={selected?.ticker ?? ""}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors appearance-none cursor-pointer"
            >
              {validStocks.map((s) => (
                <option key={s.ticker} value={s.ticker}>
                  {s.ticker} — {s.dividendYield?.toFixed(2)}%
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <p className="text-xs text-muted-foreground">
              {selected.name} · {fmtCHF(priceInCHF)} per share (converted from {currency})
            </p>
          )}
        </div>

        {/* Results */}
        {selected && (
          <div className="flex flex-col justify-center divide-y divide-border/60">
            {results.map(({ label, value, highlight }) => (
              <div key={label} className="flex items-baseline justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className={`font-data font-bold text-lg ${highlight ? "text-emerald-700" : "text-foreground"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-4">
        <p className="text-xs text-muted-foreground">
          Not investment advice. FX rates are approximate. Prices and dividends can change.
        </p>
      </div>
    </div>
  );
}
