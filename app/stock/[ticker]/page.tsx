import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SustainabilityBadge } from "@/components/SustainabilityBadge";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, BarChart2, Scale, TrendingUp, ShieldCheck, Globe, Building2, CalendarDays } from "lucide-react";
import type { Stock } from "@/types/stock";

export const dynamic = "force-dynamic";

function fmt(v: number | null, decimals = 2, suffix = "") {
  if (v === null || v === undefined) return "—";
  return `${v.toFixed(decimals)}${suffix}`;
}
function fmtPrice(price: number | null, currency: string) {
  if (!price) return "—";
  return new Intl.NumberFormat("de-CH", {
    style: "currency", currency, minimumFractionDigits: 2,
  }).format(price);
}
function fmtMarketCap(mc: number | null) {
  if (!mc) return "—";
  if (mc >= 1e12) return `${(mc / 1e12).toFixed(1)}T`;
  if (mc >= 1e9)  return `${(mc / 1e9).toFixed(1)}B`;
  return `${(mc / 1e6).toFixed(0)}M`;
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const decoded = decodeURIComponent(ticker);

  const stock = await prisma.stock.findUnique({
    where: { ticker: decoded },
    include: { dividends: { orderBy: { exDate: "desc" }, take: 20 } },
  }) as (Stock & { dividends: { id: string; exDate: Date; amount: number; currency: string; frequency: string }[] }) | null;

  if (!stock) notFound();

  const metrics = [
    { label: "Current Price",    value: fmtPrice(stock.currentPrice, stock.currency),                                icon: DollarSign,  highlight: false },
    { label: "Annual Dividend",  value: stock.annualDividend ? fmtPrice(stock.annualDividend, stock.currency) : "—", icon: TrendingUp,  highlight: false },
    { label: "Dividend Yield",   value: fmt(stock.dividendYield, 2, "%"),                                             icon: Percent,     highlight: true  },
    { label: "Payout Ratio",     value: fmt(stock.payoutRatio, 1, "%"),                                               icon: BarChart2,   highlight: false },
    { label: "P/E Ratio",        value: fmt(stock.peRatio, 1),                                                        icon: Scale,       highlight: false },
    { label: "Beta",             value: fmt(stock.beta, 2),                                                           icon: ShieldCheck, highlight: false },
    { label: "Market Cap",       value: fmtMarketCap(stock.marketCap),                                                icon: Building2,   highlight: false },
    { label: "Debt / Equity",    value: fmt(stock.debtToEquity, 2),                                                   icon: BarChart2,   highlight: false },
  ];

  const taxInfo: Record<string, { title: string; items: string[] }> = {
    CH: {
      title: "Swiss Stock",
      items: [
        "Withholding tax (Verrechnungssteuer): 35% deducted automatically.",
        "Full refund available via your Swiss tax return (Form 86).",
        "Shares must be in your account on the ex-date — don't sell before it.",
      ],
    },
    US: {
      title: "US Stock",
      items: [
        "US withholding tax: 15% for Swiss residents under the tax treaty (DBA).",
        "Deducted directly by your broker.",
        "Only partially creditable — effective burden remains ~15%.",
      ],
    },
    EU: {
      title: "European Stock",
      items: [
        "Withholding tax varies by country: 15–26.375% (e.g. Germany: 26.375%, France: 28%).",
        "Partially recoverable under tax treaties.",
        "Recovery effort often exceeds the tax saving for small amounts.",
      ],
    },
  };
  const tax = stock.region ? taxInfo[stock.region] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">

        {/* ── Hero ───────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-data font-bold border-primary/25 text-primary bg-primary/[0.07]">
                  {stock.ticker}
                </Badge>
                <Badge variant="outline" className="border-border text-muted-foreground text-xs">{stock.exchange}</Badge>
                {stock.region && (
                  <Badge variant="outline" className="border-border text-muted-foreground text-xs flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />{stock.region}
                  </Badge>
                )}
                {stock.sector && (
                  <Badge variant="secondary" className="text-xs">{stock.sector}</Badge>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-tight">
                {stock.name}
              </h1>
              <SustainabilityBadge status={stock.sustainabilityStatus as never} />
            </div>

            <div className="text-right space-y-1">
              <div className="font-data font-bold text-4xl text-foreground leading-none">
                {fmtPrice(stock.currentPrice, stock.currency)}
              </div>
              {stock.dividendYield !== null && (
                <div className="font-data font-semibold text-xl text-emerald-700">
                  {fmt(stock.dividendYield, 2, "% yield")}
                </div>
              )}
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {stock.currency} · {stock.exchange}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2-column layout ────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* LEFT: Metrics + Tax */}
          <div className="space-y-6">

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metrics.map(({ label, value, icon: Icon, highlight }) => (
                <div
                  key={label}
                  className={`rounded-xl border p-4 shadow-sm ${
                    highlight
                      ? "border-primary/20 bg-primary/[0.03]"
                      : "border-border bg-card"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-3 ${highlight ? "text-emerald-600" : "text-muted-foreground"}`} />
                  <div className={`font-data text-xl font-bold leading-none ${highlight ? "text-emerald-700" : "text-foreground"}`}>
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">{label}</div>
                </div>
              ))}
            </div>

            {/* Tax guidance */}
            {tax && (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Tax Guidance — {tax.title}</h2>
                </div>
                <ul className="p-5 space-y-2">
                  {tax.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT: Sustainability + Dividend History */}
          <div className="space-y-6">

            {/* Sustainability */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="px-5 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Dividend Sustainability</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <SustainabilityBadge status={stock.sustainabilityStatus as never} />
                </div>
                <div className="rounded-lg bg-muted/50 border border-border/60 p-4 space-y-2.5">
                  {[
                    { dot: "bg-emerald-600", status: "Sustainable", desc: "Payout < 60%, positive growth" },
                    { dot: "bg-amber-500",   status: "Review",      desc: "Payout 60–85% or stagnant" },
                    { dot: "bg-red-500",     status: "At Risk",     desc: "Payout > 85% or cut" },
                  ].map(({ dot, status, desc }) => (
                    <div key={status} className="flex items-center gap-2.5 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                      <span className="font-medium text-foreground w-20 shrink-0">{status}</span>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dividend history */}
            {stock.dividends.length > 0 && (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Dividend History</h2>
                </div>
                <div className="divide-y divide-border/50">
                  {stock.dividends.map((d, i) => (
                    <div key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-emerald-600" : "bg-border"}`} />
                        <span className="font-data text-sm text-muted-foreground">
                          {new Date(d.exDate).toLocaleDateString("en-CH")}
                        </span>
                        <span className="text-xs text-muted-foreground/50 hidden sm:inline">{d.frequency}</span>
                      </div>
                      <span className="font-data font-semibold text-sm text-foreground">
                        {new Intl.NumberFormat("de-CH", { style: "currency", currency: d.currency }).format(d.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-5 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-muted-foreground">
          DividendWatch · Open Source (MIT) · Data via Yahoo Finance · Not investment advice
        </div>
      </footer>
    </div>
  );
}
