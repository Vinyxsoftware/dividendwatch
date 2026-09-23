"use client";
import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { usePortfolioStore } from "@/lib/portfolioStore";
import { toCHF } from "@/lib/fx";
import { fmtCHF, fmtPrice } from "@/lib/format";
import type { Stock } from "@/types/stock";
import { Trash2, Plus, Wallet } from "lucide-react";

export function PortfolioClient({ stocks }: { stocks: Stock[] }) {
  const { holdings, addHolding, removeHolding, updateShares } = usePortfolioStore();
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("10");

  const byTicker = new Map(stocks.map((s) => [s.ticker, s]));
  const sortedStocks = [...stocks].sort((a, b) => a.name.localeCompare(b.name));

  const rows = holdings
    .map((h) => {
      const stock = byTicker.get(h.ticker);
      if (!stock) return null;
      const valueCHF = toCHF((stock.currentPrice ?? 0) * h.shares, stock.currency);
      const annualIncomeCHF = toCHF((stock.annualDividend ?? 0) * h.shares, stock.currency);
      return { holding: h, stock, valueCHF, annualIncomeCHF };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const totalValue = rows.reduce((a, r) => a + r.valueCHF, 0);
  const totalAnnualIncome = rows.reduce((a, r) => a + r.annualIncomeCHF, 0);
  const portfolioYield = totalValue > 0 ? (totalAnnualIncome / totalValue) * 100 : 0;
  const avgStockYield = rows.length > 0
    ? rows.reduce((a, r) => a + (r.stock.dividendYield ?? 0), 0) / rows.length
    : 0;

  function handleAdd() {
    const sharesNum = parseFloat(shares);
    if (!ticker || !sharesNum || sharesNum <= 0) return;
    addHolding(ticker, sharesNum);
    setShares("10");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            My Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Track your own holdings and see your real dividend income. Stored only in this browser — no account needed.
          </p>
        </div>

        {/* Add holding */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Add a holding</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground block">Stock</label>
              <select
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select a stock…</option>
                {sortedStocks.map((s) => (
                  <option key={s.ticker} value={s.ticker}>{s.name} ({s.ticker})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 w-28">
              <label className="text-xs font-medium text-muted-foreground block">Shares</label>
              <input
                type="number"
                min={0.0001}
                step="any"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground font-data text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!ticker}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-2">
            <Wallet className="w-6 h-6 text-muted-foreground/50 mx-auto" />
            <p className="text-sm text-muted-foreground">No holdings yet. Add a stock above to see your dividend income.</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="bg-card px-5 py-4">
                <div className="font-data text-2xl font-bold text-foreground leading-none">{fmtCHF(totalValue)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Portfolio value</div>
              </div>
              <div className="bg-card px-5 py-4">
                <div className="font-data text-2xl font-bold text-emerald-700 dark:text-emerald-400 leading-none">{fmtCHF(totalAnnualIncome)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Annual dividend income</div>
              </div>
              <div className="bg-card px-5 py-4">
                <div className="font-data text-2xl font-bold text-emerald-700 dark:text-emerald-400 leading-none">{fmtCHF(totalAnnualIncome / 12)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Monthly, avg.</div>
              </div>
              <div className="bg-card px-5 py-4">
                <div className="font-data text-2xl font-bold text-foreground leading-none">{portfolioYield.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">
                  Portfolio yield <span className="opacity-60">(avg. stock: {avgStockYield.toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Holdings table */}
            <div className="rounded-xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="bg-muted/60 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                    <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Shares</th>
                    <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Price</th>
                    <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                    <th className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-right text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Annual Income</th>
                    <th className="bg-muted/60 px-2 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ holding, stock, valueCHF, annualIncomeCHF }) => (
                    <tr key={holding.ticker} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <Link href={`/stock/${encodeURIComponent(stock.ticker)}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                          {stock.name}
                        </Link>
                        <div className="text-xs text-muted-foreground/50 mt-0.5">{stock.ticker}</div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <input
                          type="number"
                          min={0.0001}
                          step="any"
                          value={holding.shares}
                          onChange={(e) => updateShares(holding.ticker, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 rounded-md bg-muted border border-border text-foreground font-data text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </td>
                      <td className="px-4 py-4 text-right font-data text-sm text-muted-foreground hidden sm:table-cell">
                        {fmtPrice(stock.currentPrice, stock.currency)}
                      </td>
                      <td className="px-4 py-4 text-right font-data text-sm font-medium text-foreground">
                        {fmtCHF(valueCHF)}
                      </td>
                      <td className="bg-emerald-50/40 dark:bg-emerald-950/15 px-4 py-4 text-right font-data text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        {fmtCHF(annualIncomeCHF)}
                      </td>
                      <td className="px-2 py-4 text-center">
                        <button
                          onClick={() => removeHolding(holding.ticker)}
                          aria-label={`Remove ${stock.ticker}`}
                          className="text-muted-foreground/50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          Not investment advice. Values are converted to CHF using approximate FX rates for comparison only. Stored locally in your browser — clearing site data will remove it.
        </p>
      </main>
    </div>
  );
}
