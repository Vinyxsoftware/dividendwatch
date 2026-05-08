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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* Page heading */}
        <div className="space-y-3">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Dividend Stock Rankings
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Yield rankings, sustainability scores, and tax guidance for retail investors in Switzerland, Germany, and Austria.
          </p>

          {/* Compact stats strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm pt-1">
            <span className="text-muted-foreground">
              <span className="font-data font-semibold text-foreground">{stocks.length}</span> stocks tracked
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="text-muted-foreground">
              Avg. yield <span className="font-data font-semibold text-emerald-400">{avgYield}%</span>
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="text-muted-foreground">
              Top yield <span className="font-data font-semibold text-emerald-400">{topYield}%</span>
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="text-muted-foreground font-data text-xs">CH · EU · US</span>
          </div>
        </div>

        {/* Tool links */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/simulator"
            className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">Savings Plan Simulator</div>
              <div className="text-xs text-muted-foreground">DRIP calculator, up to 40 years</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
          </Link>

          <Link
            href="/wachstum"
            className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border hover:border-sky-400/40 transition-colors"
          >
            <Rocket className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-sky-400 transition-colors" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">Growth Stocks</div>
              <div className="text-xs text-muted-foreground">NVDA, MSFT, AMZN and more</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-0.5 group-hover:text-sky-400 transition-all" />
          </Link>
        </div>

        {/* Budget Calculator */}
        <BudgetCalculator stocks={stocks} />

        {/* Rankings */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">Dividend Rankings</h2>
          <StockTable stocks={stocks} />
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          DividendWatch is an information tool, not investment advice. All data is for informational purposes only. Stock investments carry risk. Past returns do not guarantee future results.
        </p>
      </main>

      <footer className="border-t border-border py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-display">Dividend<span className="text-primary">Watch</span></span>
          <span>Open Source · MIT · Data via Yahoo Finance · Not investment advice</span>
        </div>
      </footer>
    </div>
  );
}
