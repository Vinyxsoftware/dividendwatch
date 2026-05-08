"use client";
import { useState } from "react";
import { TrendingUp, Calendar, Wallet, Minus } from "lucide-react";
import type { Stock } from "@/types/stock";

function fmtCHF(v: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency", currency: "CHF", minimumFractionDigits: 2,
  }).format(v);
}

export function BudgetCalculator({ stocks }: { stocks: Stock[] }) {
  const [budget, setBudget] = useState("500");
  const [ticker, setTicker] = useState("");

  const validStocks = stocks.filter((s) => s.currentPrice && s.annualDividend);
  const selected = validStocks.find((s) => s.ticker === ticker) ?? validStocks[0];

  const budgetNum = parseFloat(budget) || 0;
  const shares    = selected ? Math.floor(budgetNum / (selected.currentPrice ?? 1)) : 0;
  const annual    = shares * (selected?.annualDividend ?? 0);
  const monthly   = annual / 12;
  const remaining = budgetNum - shares * (selected?.currentPrice ?? 0);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Budget Calculator</h2>
        <p className="text-xs text-muted-foreground mt-0.5">How much dividend income does your budget buy?</p>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Budget (CHF)</label>
            <input
              type="number"
              min={0}
              max={100000}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground font-data text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Stock</label>
            <select
              value={selected?.ticker ?? ""}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors appearance-none cursor-pointer"
            >
              {validStocks.map((s) => (
                <option key={s.ticker} value={s.ticker} className="bg-[#0D1420]">
                  {s.ticker} — {s.dividendYield?.toFixed(2)}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {selected && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Shares",            value: shares.toString(),  icon: TrendingUp, color: "text-foreground" },
              { label: "Annual dividend",   value: fmtCHF(annual),     icon: Calendar,   color: "text-emerald-400" },
              { label: "Monthly dividend",  value: fmtCHF(monthly),    icon: Wallet,     color: "text-emerald-400" },
              { label: "Remaining",         value: fmtCHF(remaining),  icon: Minus,      color: "text-muted-foreground" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-lg bg-muted/50 border border-border/60 p-3">
                <Icon className={`w-3.5 h-3.5 mb-2 ${color}`} />
                <div className={`text-base font-data font-semibold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Not investment advice. Prices and dividends can change. Dividends are not guaranteed.
        </p>
      </div>
    </div>
  );
}
