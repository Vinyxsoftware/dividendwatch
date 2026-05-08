import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { GROWTH_TICKERS } from "@/lib/yahoo";
import { Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

function fmt(v: number | null, d = 2, s = "") {
  if (v === null || v === undefined) return "—";
  return `${v.toFixed(d)}${s}`;
}
function fmtPrice(p: number | null, c: string) {
  if (!p) return "—";
  return new Intl.NumberFormat("de-CH", {
    style: "currency", currency: c, minimumFractionDigits: 2,
  }).format(p);
}
function fmtCap(mc: number | null) {
  if (!mc) return "—";
  if (mc >= 1e12) return `${(mc / 1e12).toFixed(1)}T`;
  if (mc >= 1e9)  return `${(mc / 1e9).toFixed(1)}B`;
  return `${(mc / 1e6).toFixed(0)}M`;
}

export default async function WachstumPage() {
  const growthTickers = GROWTH_TICKERS.map((t) => t.ticker);
  const stocks = await prisma.stock.findMany({
    where: { ticker: { in: growthTickers } },
    orderBy: { marketCap: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Growth Stocks
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
            High growth potential with little or no dividend. Capital appreciation over income.
          </p>
        </div>

        {/* Strategy comparison */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Strategy Comparison</h2>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              {
                title: "Dividend Strategy",
                color: "text-emerald-700",
                pros: ["Regular passive income", "Stable, established companies", "Good for retirement / cash flow"],
                cons: ["Lower price appreciation", "Withholding tax deductions"],
              },
              {
                title: "Growth Strategy",
                color: "text-blue-600",
                pros: ["Higher price appreciation potential", "Reinvestment instead of dividends", "Ideal for long time horizons"],
                cons: ["Higher volatility", "No passive income"],
              },
            ].map(({ title, color, pros, cons }) => (
              <div key={title} className="p-5 space-y-3">
                <div className={`text-sm font-semibold ${color}`}>{title}</div>
                <div className="space-y-1.5">
                  {pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                      {p}
                    </div>
                  ))}
                  {cons.map((c) => (
                    <div key={c} className="flex items-start gap-2 text-xs text-muted-foreground/50">
                      <X className="w-3 h-3 mt-0.5 shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stocks table */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Growth Stock List
            <span className="ml-2 text-sm font-normal text-muted-foreground">{stocks.length} stocks</span>
          </h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">Ticker</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">P/E</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Beta</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Market Cap</th>
                  <th className="px-4 py-2.5 hidden lg:table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/stock/${encodeURIComponent(s.ticker)}`}
                        className="font-data font-semibold text-sm text-blue-600 hover:underline underline-offset-2"
                      >
                        {s.ticker}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm font-medium text-foreground line-clamp-1">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.exchange}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-data text-sm text-foreground">
                      {fmtPrice(s.currentPrice, s.currency)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-data text-sm text-muted-foreground hidden sm:table-cell">
                      {fmt(s.peRatio, 1)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-data text-sm text-muted-foreground hidden sm:table-cell">
                      {fmt(s.beta, 2)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-data text-sm text-muted-foreground hidden md:table-cell">
                      {fmtCap(s.marketCap)}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {s.dividendYield && s.dividendYield > 0 && (
                        <Badge variant="outline" className="text-xs border-primary/25 text-primary bg-primary/[0.07]">
                          {fmt(s.dividendYield, 2, "% div.")}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          Not investment advice. Past price performance does not guarantee future returns.
        </p>
      </main>
    </div>
  );
}
