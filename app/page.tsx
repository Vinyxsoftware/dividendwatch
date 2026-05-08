import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { StockTable } from "@/components/StockTable";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { BarChart2, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Stock } from "@/types/stock";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stocks = (await prisma.stock.findMany({
    orderBy: { dividendYield: "desc" },
  })) as unknown as Stock[];

  const withYield = stocks.filter((s) => s.dividendYield !== null);
  const avgYield  = withYield.length
    ? (withYield.reduce((a, s) => a + (s.dividendYield ?? 0), 0) / withYield.length).toFixed(2)
    : "—";
  const topYield  = withYield[0]?.dividendYield?.toFixed(2) ?? "—";
  const topTicker = withYield[0]?.ticker ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* Page heading */}
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
            Dividend Stock Rankings
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Yield rankings, sustainability scores, and tax guidance for retail investors in Switzerland, Germany, and Austria.
          </p>

          {/* Stats data bar */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden mt-6 border border-border">
            <div className="bg-card px-4 py-3.5">
              <div className="font-data text-2xl font-bold text-foreground">{stocks.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Stocks tracked</div>
            </div>
            <div className="bg-card px-4 py-3.5">
              <div className="font-data text-2xl font-bold text-emerald-700">{avgYield}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Avg. yield</div>
            </div>
            <div className="bg-card px-4 py-3.5">
              <div className="font-data text-2xl font-bold text-emerald-700">{topYield}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Top yield</div>
            </div>
            <div className="hidden sm:block bg-card px-4 py-3.5">
              <div className="font-data text-lg font-bold text-foreground">{topTicker || "CH · EU · US"}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{topTicker ? "Best yield" : "Regions"}</div>
            </div>
          </div>
        </div>

        {/* Tool feature cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/simulator"
            className="group flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-primary" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Savings Plan Simulator</div>
              <div className="text-xs text-muted-foreground mt-0.5">DRIP calculator · up to 40 years</div>
            </div>
          </Link>

          <Link
            href="/wachstum"
            className="group flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:border-blue-400/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-blue-600" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Growth Stocks</div>
              <div className="text-xs text-muted-foreground mt-0.5">NVDA, MSFT, AMZN and more</div>
            </div>
          </Link>
        </div>

        {/* Budget Calculator */}
        <BudgetCalculator stocks={stocks} />

        {/* Rankings */}
        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-base font-semibold text-foreground">Dividend Rankings</h2>
            <span className="text-sm text-muted-foreground font-data">{stocks.length} stocks</span>
          </div>
          <StockTable stocks={stocks} />
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          DividendWatch is an information tool, not investment advice. All data is for informational purposes only. Stock investments carry risk. Past returns do not guarantee future results.
        </p>
      </main>

      <footer className="border-t border-border py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">DividendWatch</span>
          </span>
          <span>Open Source · MIT · Data via Yahoo Finance · Not investment advice</span>
        </div>
      </footer>
    </div>
  );
}
