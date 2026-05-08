import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { GROWTH_TICKERS } from "@/lib/yahoo";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

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
  if (mc >= 1e12) return `${(mc / 1e12).toFixed(1)} Bio.`;
  if (mc >= 1e9)  return `${(mc / 1e9).toFixed(1)} Mrd.`;
  return `${(mc / 1e6).toFixed(0)} Mio.`;
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
          <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">
            Wachstums<span className="text-sky-400">aktien</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            Hohes Wachstumspotenzial — oft ohne Dividende, aber starkes Kapitalwachstum.
          </p>
        </div>

        {/* Comparison */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <h2 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-widest text-muted-foreground">
            Strategievergleich
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4 space-y-2">
              <div className="font-display font-semibold text-primary flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Dividendenstrategie
              </div>
              {[
                [true,  "Regelmässiges passives Einkommen"],
                [true,  "Stabile, etablierte Unternehmen"],
                [true,  "Gut für Ruhestand / Cashflow"],
                [false, "Geringeres Kurswachstum"],
                [false, "Quellensteuer-Abzüge"],
              ].map(([pos, text], i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${pos ? "text-primary/80" : "text-muted-foreground/60"}`}>
                  {pos ? <TrendingUp className="w-3 h-3 shrink-0" /> : <Minus className="w-3 h-3 shrink-0" />}
                  {text as string}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-sky-400/15 bg-sky-400/[0.04] p-4 space-y-2">
              <div className="font-display font-semibold text-sky-400 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" /> Wachstumsstrategie
              </div>
              {[
                [true,  "Höheres Kurspotenzial"],
                [true,  "Reinvestition statt Dividende"],
                [true,  "Ideal für lange Anlagehorizonte"],
                [false, "Höhere Volatilität"],
                [false, "Kein passiver Cashflow"],
              ].map(([pos, text], i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${pos ? "text-sky-400/80" : "text-muted-foreground/60"}`}>
                  {pos ? <TrendingUp className="w-3 h-3 shrink-0" /> : <TrendingDown className="w-3 h-3 shrink-0" />}
                  {text as string}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stocks grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {stocks.map((s) => (
            <Link href={`/stock/${encodeURIComponent(s.ticker)}`} key={s.id}>
              <div className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:border-sky-400/25 hover:bg-sky-400/[0.03] transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-data font-bold text-sky-400 text-lg">{s.ticker}</div>
                    <div className="text-sm font-medium text-foreground mt-0.5 line-clamp-1">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.exchange}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-data font-bold text-foreground text-lg">{fmtPrice(s.currentPrice, s.currency)}</div>
                    {s.dividendYield && s.dividendYield > 0 && (
                      <Badge variant="outline" className="mt-1 text-xs border-primary/25 text-primary bg-primary/[0.07]">
                        {fmt(s.dividendYield, 2, "% Div.")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "KGV",        value: fmt(s.peRatio, 1)  },
                    { label: "Beta",       value: fmt(s.beta, 2)     },
                    { label: "Market Cap", value: fmtCap(s.marketCap) },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-white/[0.03] border border-white/6 p-2 text-center">
                      <div className="font-data text-sm font-semibold text-foreground">{value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4 text-sm text-amber-400/80">
          Keine Anlageberatung. Vergangene Kursentwicklungen sind keine Garantie für zukünftige Renditen.
        </div>
      </main>
    </div>
  );
}
