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

  const withYield  = stocks.filter((s) => s.dividendYield !== null);
  const avgYield   = withYield.length
    ? (withYield.reduce((a, s) => a + (s.dividendYield ?? 0), 0) / withYield.length).toFixed(2)
    : "—";
  const topYield   = withYield[0]?.dividendYield?.toFixed(2) ?? "—";
  const topTicker  = withYield[0]?.ticker ?? "";
  const chCount    = stocks.filter((s) => s.region === "CH").length;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-12">

        {/* ── Page heading ─────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              Dividend Stock Rankings
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Income stock rankings for retail investors in Switzerland, Germany, and Austria.
            </p>
          </div>

          {/* Stats data bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border shadow-sm">
            <div className="bg-card px-5 py-4">
              <div className="font-data text-3xl font-bold text-foreground leading-none">{stocks.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Stocks tracked</div>
            </div>
            <div className="bg-card px-5 py-4">
              <div className="font-data text-3xl font-bold text-emerald-700 leading-none">{avgYield}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Avg. yield</div>
            </div>
            <div className="bg-card px-5 py-4">
              <div className="font-data text-3xl font-bold text-emerald-700 leading-none">{topYield}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Top yield</div>
            </div>
            <div className="bg-card px-5 py-4">
              <div className="font-data text-3xl font-bold text-foreground leading-none">{chCount}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">Swiss stocks</div>
            </div>
          </div>
        </div>

        {/* ── Stock Rankings Table — PRIMARY CONTENT ─── */}
        <section>
          <StockTable stocks={stocks} />
        </section>

        {/* ── Tools & Calculators ───────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Tools & Calculators</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Go deeper — model your income and explore growth alternatives.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Budget calculator — left column */}
            <BudgetCalculator stocks={stocks} />

            {/* Feature cards — right column */}
            <div className="flex flex-col gap-4">
              <Link
                href="/simulator"
                className="group flex-1 flex flex-col justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-0.5 group-hover:text-primary transition-all mt-1" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-semibold text-foreground">Savings Plan Simulator</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Model dividend reinvestment over up to 40 years. See how compounding turns monthly contributions into real wealth.
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary">
                  Open simulator <ArrowRight className="w-3 h-3" />
                </div>
              </Link>

              <Link
                href="/wachstum"
                className="group flex-1 flex flex-col justify-between p-6 rounded-xl border border-border bg-card hover:border-blue-300/60 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5 text-blue-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all mt-1" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-semibold text-foreground">Growth Stocks</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Not every portfolio needs dividends. Explore high-growth stocks and compare capital appreciation vs. income strategies.
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-blue-600">
                  Explore growth <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ────────────────────────────── */}
        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          DividendWatch is an information tool, not investment advice. All data is for informational purposes only. Stock investments carry risk. Past returns do not guarantee future results.
        </p>
      </main>

      <footer className="border-t border-border py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">DividendWatch</span>
          </span>
          <span>Open Source · MIT · Data via Yahoo Finance · Not investment advice</span>
        </div>
      </footer>
    </div>
  );
}
