"use client";
import { useState } from "react";
import { Calculator, TrendingUp, Calendar, Wallet } from "lucide-react";
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

  const results = [
    { label: "Aktien kaufbar",     value: shares.toString(),   icon: TrendingUp,  color: "text-primary" },
    { label: "Dividende / Jahr",   value: fmtCHF(annual),      icon: Calendar,    color: "text-emerald-400" },
    { label: "Dividende / Monat",  value: fmtCHF(monthly),     icon: Wallet,      color: "text-sky-400" },
    { label: "Restbetrag",         value: fmtCHF(remaining),   icon: Calculator,  color: "text-muted-foreground" },
  ];

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] overflow-hidden">
      {/* Header stripe */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground">Budgetrechner</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Wie viel Dividende bekomme ich für mein Budget?</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Budget (CHF)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100000}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground font-data text-sm focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Aktie
            </label>
            <select
              value={selected?.ticker ?? ""}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              {validStocks.map((s) => (
                <option key={s.ticker} value={s.ticker} className="bg-[#0D1525]">
                  {s.ticker} — {s.dividendYield?.toFixed(2)}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {selected && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {results.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
                <Icon className={`w-4 h-4 mb-2 ${color}`} />
                <div className={`text-xl font-data font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4 border-t border-white/6 pt-4">
          Kein Anlageberatung. Kurse und Dividenden können sich ändern. Dividenden sind nicht garantiert.
        </p>
      </div>
    </div>
  );
}
