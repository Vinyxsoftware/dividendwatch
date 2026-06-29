import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { GROWTH_TICKERS } from "@/lib/yahoo";
import { fmt, fmtPrice, fmtMarketCap } from "@/lib/format";
import { Check, X, TrendingUp, TrendingDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WachstumPage() {
  const growthTickers = GROWTH_TICKERS.map((t) => t.ticker);
  const stocks = await prisma.stock.findMany({
    where: { ticker: { in: growthTickers } },
    orderBy: { marketCap: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* Heading */}
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
            Growth Stocks
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            High growth potential with little or no dividend. Capital appreciation over income.
          </p>
        </div>

        {/* ── Strategy comparison — horizontal banner ── */}
        <div className="grid sm:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border shadow-sm">
          {[
            {
              label: "Dividend Strategy",
              icon: TrendingUp,
              color: "text-emerald-700",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              pros: ["Regular passive income", "Stable, established companies", "Good for retirement / cash flow"],
              cons: ["Lower price appreciation", "Withholding tax deductions"],
            },
            {
              label: "Growth Strategy",
              icon: TrendingDown,
              color: "text-blue-600",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              pros: ["Higher price appreciation potential", "Reinvestment instead of dividends", "Ideal for long time horizons"],
              cons: ["Higher volatility", "No passive income"],
            },
          ].map(({ label, icon: Icon, color, iconBg, iconColor, pros, cons }) => (
            <div key={label} className="bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
              </div>
              <div className="space-y-2">
                {pros.map((p) => (
                  <div key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                    {p}
                  </div>
                ))}
                {cons.map((c) => (
                  <div key={c} className="flex items-start gap-2 text-xs text-muted-foreground/60">
                    <X className="w-3 h-3 mt-0.5 shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Growth stock table ────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold text-foreground">Growth Stock List</h2>
            <span className="text-sm font-normal text-muted-foreground font-data">{stocks.length} stocks</span>
          </div>

          <div className="rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="bg-muted/60 px-3 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-10">#</th>
                  <th className="bg-muted/60 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                  <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">P/E</th>
                  <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Beta</th>
                  <th className="bg-muted/60 px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Market Cap</th>
                  <th className="bg-muted/60 px-4 py-3 hidden lg:table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s, i) => (
                  <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="px-3 py-4 text-center">
                      <span className="font-data text-xs font-semibold text-muted-foreground/40">{i + 1}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/stock/${encodeURIComponent(s.ticker)}`}
                        className="font-semibold text-sm text-foreground hover:text-blue-600 transition-colors"
                      >
                        {s.name}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        <code className="font-data text-xs bg-muted border border-border/60 px-1.5 py-0.5 rounded text-muted-foreground">
                          {s.ticker}
                        </code>
                        <span className="text-xs text-muted-foreground/40">{s.exchange}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-data text-sm font-medium text-foreground whitespace-nowrap">
                      {fmtPrice(s.currentPrice, s.currency)}
                    </td>
                    <td className="px-4 py-4 text-right font-data text-sm text-muted-foreground hidden sm:table-cell">
                      {fmt(s.peRatio, 1)}
                    </td>
                    <td className="px-4 py-4 text-right font-data text-sm text-muted-foreground hidden sm:table-cell">
                      {fmt(s.beta, 2)}
                    </td>
                    <td className="px-4 py-4 text-right font-data text-sm text-muted-foreground hidden md:table-cell">
                      {fmtMarketCap(s.marketCap)}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
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
