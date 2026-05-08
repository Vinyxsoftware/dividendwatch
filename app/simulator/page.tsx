"use client";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SimulatorChart } from "@/components/SimulatorChart";
import { TrendingUp, DollarSign, PiggyBank, Sparkles } from "lucide-react";

function fmtCHF(v: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency", currency: "CHF", maximumFractionDigits: 0,
  }).format(v);
}

function calcDRIP(
  monthlyBudget: number,
  initialPrice: number,
  annualDividendPerShare: number,
  annualGrowthRate: number,
  years: number,
) {
  const data = [];
  let totalShares = 0, totalContributions = 0, totalDividends = 0;
  let price = initialPrice;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      totalContributions += monthlyBudget;
      totalShares += monthlyBudget / price;
      const monthlyDiv = (totalShares * annualDividendPerShare) / 12;
      totalDividends += monthlyDiv;
      totalShares += monthlyDiv / price;
      price *= 1 + annualGrowthRate / 12;
    }
    data.push({
      year: y,
      depotwert:    Math.round(totalShares * price),
      einzahlungen: Math.round(totalContributions),
      dividenden:   Math.round(totalDividends),
    });
  }
  return data;
}

const inputs = [
  { id: "budget",    label: "Monthly budget",    unit: "CHF", min: 10,   max: 10000, step: 50,  default: "500"  },
  { id: "price",     label: "Stock price",        unit: "CHF", min: 1,    max: 5000,  step: 1,   default: "50"   },
  { id: "divAnnual", label: "Dividend / share / yr", unit: "CHF", min: 0.01, max: 50, step: 0.1, default: "2.50" },
  { id: "growth",    label: "Annual price return",unit: "%",   min: 0,    max: 20,    step: 0.5, default: "3"    },
  { id: "years",     label: "Time horizon",       unit: "yrs", min: 1,    max: 40,    step: 1,   default: "20"   },
];

export default function SimulatorPage() {
  const [vals, setVals] = useState<Record<string, string>>({
    budget: "500", price: "50", divAnnual: "2.50", growth: "3", years: "20",
  });

  const data = useMemo(() => calcDRIP(
    parseFloat(vals.budget)    || 500,
    parseFloat(vals.price)     || 50,
    parseFloat(vals.divAnnual) || 2.5,
    (parseFloat(vals.growth)   || 3) / 100,
    Math.min(parseInt(vals.years) || 20, 40),
  ), [vals]);

  const last   = data[data.length - 1];
  const profit = (last?.depotwert ?? 0) - (last?.einzahlungen ?? 0);

  const results = [
    { label: `Portfolio after ${vals.years} yr`,  value: fmtCHF(last?.depotwert ?? 0),    color: "text-emerald-700", icon: TrendingUp },
    { label: "Total contributions",               value: fmtCHF(last?.einzahlungen ?? 0),  color: "text-blue-600",    icon: DollarSign },
    { label: "Cumulative dividends",              value: fmtCHF(last?.dividenden ?? 0),    color: "text-foreground",  icon: PiggyBank  },
    { label: "Total gain",                        value: fmtCHF(profit),                   color: profit > 0 ? "text-emerald-700" : "text-red-600", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Savings Plan Simulator
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
            Project your portfolio value with Dividend Reinvestment (DRIP) over up to 40 years.
          </p>
        </div>

        {/* Inputs */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {inputs.map(({ id, label, unit, min, max, step }) => (
              <div key={id} className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  {label}
                  <span className="ml-1 text-muted-foreground/50">{unit}</span>
                </label>
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={vals[id]}
                  onChange={(e) => setVals((v) => ({ ...v, [id]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground font-data text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {results.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <Icon className={`w-4 h-4 mb-2 ${color}`} />
              <div className={`text-lg font-data font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Portfolio growth over {vals.years} years
          </h2>
          <SimulatorChart data={data} />
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          For illustration purposes only. Past returns do not guarantee future results. Not investment advice.
        </p>
      </main>
    </div>
  );
}
