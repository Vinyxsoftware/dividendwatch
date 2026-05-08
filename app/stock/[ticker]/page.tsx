import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SustainabilityBadge } from "@/components/SustainabilityBadge";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, Percent, BarChart2, Scale,
  TrendingUp, ShieldCheck, Globe, Building2, CalendarDays,
} from "lucide-react";
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
  if (mc >= 1e12) return `${(mc / 1e12).toFixed(1)} Bio.`;
  if (mc >= 1e9)  return `${(mc / 1e9).toFixed(1)} Mrd.`;
  return `${(mc / 1e6).toFixed(0)} Mio.`;
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
    { label: "Aktueller Kurs",     value: fmtPrice(stock.currentPrice, stock.currency),                          icon: DollarSign,  accent: false },
    { label: "Dividende / Jahr",   value: stock.annualDividend ? fmtPrice(stock.annualDividend, stock.currency) : "—", icon: TrendingUp,  accent: false },
    { label: "Dividendenrendite",  value: fmt(stock.dividendYield, 2, "%"),                                       icon: Percent,     accent: true  },
    { label: "Payout Ratio",       value: fmt(stock.payoutRatio, 1, "%"),                                         icon: BarChart2,   accent: false },
    { label: "KGV (P/E)",          value: fmt(stock.peRatio, 1),                                                  icon: Scale,       accent: false },
    { label: "Beta",               value: fmt(stock.beta, 2),                                                     icon: ShieldCheck, accent: false },
    { label: "Market Cap",         value: fmtMarketCap(stock.marketCap),                                          icon: Building2,   accent: false },
    { label: "Verschuldung (D/E)", value: fmt(stock.debtToEquity, 2),                                             icon: BarChart2,   accent: false },
  ];

  const taxInfo: Record<string, { title: string; items: string[] }> = {
    CH: {
      title: "Schweizer Aktie",
      items: [
        "Verrechnungssteuer: 35% automatisch abgezogen.",
        "Vollständige Rückforderung via Steuererklärung (Formular 86).",
        "Aktien müssen am Ex-Datum im Depot sein — nicht vorher verkaufen.",
      ],
    },
    US: {
      title: "US-amerikanische Aktie",
      items: [
        "Quellensteuer USA: 15% für CH-Ansässige (DBA).",
        "Wird direkt vom Broker abgezogen.",
        "Nur teilweise anrechenbar — faktische Belastung ~15%.",
      ],
    },
    EU: {
      title: "Europäische Aktie",
      items: [
        "Quellensteuer je nach Land: 15–26.375%.",
        "Teilweise rückforderbar via DBA.",
        "Aufwand oft höher als Steuerersparnis bei kleinen Beträgen.",
      ],
    },
  };
  const tax = stock.region ? taxInfo[stock.region] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">

        {/* Hero */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="font-data font-bold border-primary/25 text-primary bg-primary/[0.07] text-sm px-2.5">
                  {stock.ticker}
                </Badge>
                <Badge variant="outline" className="border-white/12 text-muted-foreground text-xs">{stock.exchange}</Badge>
                {stock.region && (
                  <Badge variant="outline" className="border-white/12 text-muted-foreground text-xs flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />{stock.region}
                  </Badge>
                )}
                {stock.sector && (
                  <Badge variant="secondary" className="text-xs bg-white/5 border-white/8">{stock.sector}</Badge>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl text-foreground">{stock.name}</h1>
            </div>

            <div className="text-right">
              <div className="font-data font-bold text-3xl text-foreground">
                {fmtPrice(stock.currentPrice, stock.currency)}
              </div>
              {stock.dividendYield && (
                <div className="font-data font-semibold text-xl text-primary mt-1">
                  {fmt(stock.dividendYield, 2, "% Rendite")}
                </div>
              )}
              <div className="mt-2">
                <SustainabilityBadge status={stock.sustainabilityStatus as never} />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 ${
                accent
                  ? "border-primary/25 bg-primary/[0.05] glow-green-sm"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${accent ? "text-primary" : "text-muted-foreground"}`} />
              <div className={`font-data text-xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>
                {value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Sustainability details */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <h2 className="font-display font-semibold text-base text-foreground mb-4">Dividenden-Nachhaltigkeit</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Status</span>
            <SustainabilityBadge status={stock.sustainabilityStatus as never} />
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/6 p-4 space-y-2">
            {[
              { dot: "bg-emerald-400", status: "Nachhaltig",  desc: "Payout Ratio < 60% und Dividendenwachstum > 0%" },
              { dot: "bg-amber-400",   status: "Prüfen",      desc: "Payout Ratio 60–85% oder stagnierende Dividende" },
              { dot: "bg-red-400",     status: "Gefährdet",   desc: "Payout Ratio > 85% oder Dividendenkürzung" },
            ].map(({ dot, status, desc }) => (
              <div key={status} className="flex items-start gap-3 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${dot}`} />
                <span className="font-medium text-foreground w-20 shrink-0">{status}</span>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax info */}
        {tax && (
          <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.03] p-6">
            <h2 className="font-display font-semibold text-base text-sky-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Steuerliche Hinweise — {tax.title}
            </h2>
            <ul className="space-y-2">
              {tax.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-sky-400/70">
                  <span className="w-1 h-1 rounded-full bg-sky-400/50 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dividend history */}
        {stock.dividends.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <h2 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              Dividendenhistorie
            </h2>
            <div className="space-y-1">
              {stock.dividends.map((d, i) => (
                <div
                  key={d.id}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors hover:bg-white/[0.03] ${
                    i < stock.dividends.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-white/20"}`} />
                    <span className="font-data text-sm text-muted-foreground">
                      {new Date(d.exDate).toLocaleDateString("de-CH")}
                    </span>
                    <span className="text-xs text-muted-foreground/60 hidden sm:inline">{d.frequency}</span>
                  </div>
                  <span className="font-data font-semibold text-sm text-foreground">
                    {new Intl.NumberFormat("de-CH", {
                      style: "currency", currency: d.currency,
                    }).format(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-muted-foreground">
          DividendWatch · Open Source (MIT) · Daten via Yahoo Finance · Keine Anlageberatung
        </div>
      </footer>
    </div>
  );
}
