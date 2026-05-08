import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GROWTH_TICKERS } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

function fmt(v: number | null, d = 2, s = "") {
  if (v === null || v === undefined) return "—";
  return `${v.toFixed(d)}${s}`;
}

function fmtPrice(p: number | null, c: string) {
  if (!p) return "—";
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: c, minimumFractionDigits: 2 }).format(p);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Zurück</Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-semibold">🚀 Wachstumsaktien</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚀 Wachstumsaktien</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Aktien mit hohem Wachstumspotenzial — oft ohne Dividende, aber starkes Kapitalwachstum.
          </p>
        </div>

        {/* Vergleich */}
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold text-sm text-gray-900 mb-3">Dividendenstrategie vs. Wachstumsstrategie</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-1.5">
              <div className="font-semibold text-green-800">💰 Dividendenstrategie</div>
              <div className="text-green-700">✓ Regelmässiges Einkommen</div>
              <div className="text-green-700">✓ Stabile, etablierte Unternehmen</div>
              <div className="text-green-700">✓ Gut für Ruhestand / Cashflow</div>
              <div className="text-green-600 opacity-70">✗ Geringeres Kurswachstum</div>
              <div className="text-green-600 opacity-70">✗ Quellensteuer-Abzüge</div>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-1.5">
              <div className="font-semibold text-blue-800">🚀 Wachstumsstrategie</div>
              <div className="text-blue-700">✓ Höheres Kurspotenzial</div>
              <div className="text-blue-700">✓ Reinvestition statt Dividende</div>
              <div className="text-blue-700">✓ Ideal für lange Anlagehorizonte</div>
              <div className="text-blue-600 opacity-70">✗ Höhere Volatilität</div>
              <div className="text-blue-600 opacity-70">✗ Kein passiver Cashflow</div>
            </div>
          </div>
        </div>

        {/* Stocks grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {stocks.map((s) => (
            <Link href={`/stock/${encodeURIComponent(s.ticker)}`} key={s.id}>
              <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono font-semibold text-primary">{s.ticker}</div>
                      <div className="text-sm font-medium text-gray-900 mt-0.5 line-clamp-1">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{fmtPrice(s.currentPrice, s.currency)}</div>
                      <div className="text-xs text-muted-foreground">{s.exchange}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "KGV", value: fmt(s.peRatio, 1) },
                      { label: "Beta", value: fmt(s.beta, 2) },
                      { label: "Market Cap", value: fmtCap(s.marketCap) },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg bg-gray-50 p-2 text-center">
                        <div className="text-sm font-semibold text-gray-900">{value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  {s.dividendYield && s.dividendYield > 0 && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Dividende: {fmt(s.dividendYield, 2, "%")}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          ⚠️ Keine Anlageberatung. Vergangene Kursentwicklungen sind keine Garantie für zukünftige Renditen.
        </p>
      </main>
    </div>
  );
}
