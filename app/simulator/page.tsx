"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimulatorChart } from "@/components/SimulatorChart";

function fmtCHF(v: number) {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(v);
}

function calcDRIP(
  monthlyBudget: number,
  initialPrice: number,
  annualDividendPerShare: number,
  annualGrowthRate: number,
  years: number
) {
  const data = [];
  let totalShares = 0;
  let totalContributions = 0;
  let totalDividends = 0;
  let price = initialPrice;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      totalContributions += monthlyBudget;
      const newShares = monthlyBudget / price;
      totalShares += newShares;
      const monthlyDiv = (totalShares * annualDividendPerShare) / 12;
      totalDividends += monthlyDiv;
      const reinvestedShares = monthlyDiv / price;
      totalShares += reinvestedShares;
      price *= 1 + annualGrowthRate / 12;
    }
    data.push({
      year: y,
      depotwert: Math.round(totalShares * price),
      einzahlungen: Math.round(totalContributions),
      dividenden: Math.round(totalDividends),
    });
  }
  return data;
}

export default function SimulatorPage() {
  const [budget, setBudget]     = useState("500");
  const [price, setPrice]       = useState("50");
  const [divAnnual, setDiv]     = useState("2.50");
  const [growth, setGrowth]     = useState("3");
  const [years, setYears]       = useState("20");

  const data = useMemo(() => calcDRIP(
    parseFloat(budget)   || 500,
    parseFloat(price)    || 50,
    parseFloat(divAnnual)|| 2.5,
    (parseFloat(growth)  || 3) / 100,
    Math.min(parseInt(years) || 20, 40),
  ), [budget, price, divAnnual, growth, years]);

  const last = data[data.length - 1];

  const inputs = [
    { label: "Monatliches Budget (CHF)", value: budget, set: setBudget, min: "10",  max: "10000", step: "50"  },
    { label: "Aktienkurs (CHF)",         value: price,  set: setPrice,  min: "1",   max: "5000",  step: "1"   },
    { label: "Dividende / Aktie / Jahr", value: divAnnual, set: setDiv, min: "0.01",max: "50",    step: "0.1" },
    { label: "Kursrendite / Jahr (%)",   value: growth, set: setGrowth, min: "0",   max: "20",    step: "0.5" },
    { label: "Anlagezeitraum (Jahre)",   value: years,  set: setYears,  min: "1",   max: "40",    step: "1"   },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Zurück</Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-semibold">📊 Sparplan-Simulator</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sparplan-Simulator</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Wie viel ist dein Portfolio nach X Jahren wert — mit Dividenden-Reinvestition (DRIP)?
          </p>
        </div>

        {/* Inputs */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {inputs.map(({ label, value, set, min, max, step }) => (
                <div key={label} className="space-y-1.5">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type="number" min={min} max={max} step={step}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Depotwert nach " + years + " Jahren", value: fmtCHF(last?.depotwert ?? 0), color: "text-primary" },
            { label: "Einzahlungen gesamt",                  value: fmtCHF(last?.einzahlungen ?? 0), color: "text-green-600" },
            { label: "Kumulierte Dividenden",                value: fmtCHF(last?.dividenden ?? 0),   color: "text-blue-600" },
            { label: "Gewinn",                               value: fmtCHF((last?.depotwert ?? 0) - (last?.einzahlungen ?? 0)), color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border p-4">
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vermögenswachstum über {years} Jahre</CardTitle>
          </CardHeader>
          <CardContent>
            <SimulatorChart data={data} />
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          ⚠️ Diese Simulation dient nur zu Illustrationszwecken. Vergangene Renditen garantieren keine zukünftigen Ergebnisse. Kurse und Dividenden können fallen oder entfallen. Keine Anlageberatung.
        </p>
      </main>
    </div>
  );
}
