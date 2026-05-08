"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Stock } from "@/types/stock";

function fmtCHF(v: number) {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", minimumFractionDigits: 2 }).format(v);
}

export function BudgetCalculator({ stocks }: { stocks: Stock[] }) {
  const [budget, setBudget] = useState("500");
  const [ticker, setTicker] = useState("");

  const validStocks = stocks.filter((s) => s.currentPrice && s.annualDividend);
  const selected = validStocks.find((s) => s.ticker === ticker) ?? validStocks[0];

  const budgetNum = parseFloat(budget) || 0;
  const shares = selected ? Math.floor(budgetNum / (selected.currentPrice ?? 1)) : 0;
  const annual = shares * (selected?.annualDividend ?? 0);
  const monthly = annual / 12;
  const remaining = budgetNum - shares * (selected?.currentPrice ?? 0);

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          💰 Budgetrechner
        </CardTitle>
        <p className="text-sm text-muted-foreground">Wie viel Dividende erhalte ich für mein Budget?</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Monatliches Budget (CHF)</Label>
            <Input
              type="number"
              min={0}
              max={100000}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Aktie auswählen</Label>
            <Select value={selected?.ticker ?? ""} onValueChange={(v) => { if (v) setTicker(v); }}>
              <SelectTrigger>
                <SelectValue placeholder="Aktie wählen" />
              </SelectTrigger>
              <SelectContent>
                {validStocks.map((s) => (
                  <SelectItem key={s.ticker} value={s.ticker}>
                    {s.ticker} — {s.dividendYield?.toFixed(2)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selected && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white border p-3 text-center">
              <div className="text-2xl font-bold text-primary">{shares}</div>
              <div className="text-xs text-muted-foreground mt-1">Aktien kaufbar</div>
            </div>
            <div className="rounded-lg bg-white border p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{fmtCHF(annual)}</div>
              <div className="text-xs text-muted-foreground mt-1">Dividende / Jahr</div>
            </div>
            <div className="rounded-lg bg-white border p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{fmtCHF(monthly)}</div>
              <div className="text-xs text-muted-foreground mt-1">Dividende / Monat</div>
            </div>
            <div className="rounded-lg bg-white border p-3 text-center">
              <div className="text-2xl font-bold text-gray-500">{fmtCHF(remaining)}</div>
              <div className="text-xs text-muted-foreground mt-1">Restbetrag</div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          ⚠️ Dies ist kein Anlageberatung. Kurse können sich ändern. Dividenden sind nicht garantiert.
        </p>
      </CardContent>
    </Card>
  );
}
