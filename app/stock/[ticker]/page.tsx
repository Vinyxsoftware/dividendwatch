import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SustainabilityBadge } from "@/components/SustainabilityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Stock } from "@/types/stock";

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
    { label: "Aktueller Kurs",      value: fmtPrice(stock.currentPrice, stock.currency) },
    { label: "Dividende / Jahr",    value: stock.annualDividend ? fmtPrice(stock.annualDividend, stock.currency) : "—" },
    { label: "Dividendenrendite",   value: fmt(stock.dividendYield, 2, "%"), highlight: true },
    { label: "Payout Ratio",        value: fmt(stock.payoutRatio, 1, "%") },
    { label: "KGV (P/E)",           value: fmt(stock.peRatio, 1) },
    { label: "Beta",                value: fmt(stock.beta, 2) },
    { label: "Market Cap",          value: fmtMarketCap(stock.marketCap) },
    { label: "Verschuldung (D/E)",  value: fmt(stock.debtToEquity, 2) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Zurück
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono font-semibold text-primary">{stock.ticker}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{stock.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="font-mono">{stock.ticker}</Badge>
                <Badge variant="outline">{stock.exchange}</Badge>
                {stock.region && <Badge variant="outline">{stock.region}</Badge>}
                {stock.sector && <Badge variant="secondary">{stock.sector}</Badge>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {fmtPrice(stock.currentPrice, stock.currency)}
              </div>
              {stock.dividendYield && (
                <div className="text-lg font-semibold text-green-600 mt-1">
                  {fmt(stock.dividendYield, 2, "% Rendite")}
                </div>
              )}
              <div className="mt-2">
                <SustainabilityBadge status={stock.sustainabilityStatus as never} />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map(({ label, value, highlight }) => (
            <div key={label} className="bg-white rounded-xl border p-4">
              <div className={`text-xl font-bold ${highlight ? "text-green-600" : "text-gray-900"}`}>
                {value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Nachhaltigkeit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dividenden-Nachhaltigkeit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <SustainabilityBadge status={stock.sustainabilityStatus as never} />
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-1.5">
              {[
                ["🟢 Nachhaltig", "Payout Ratio < 60% und Dividendenwachstum > 0%"],
                ["🟡 Prüfen",     "Payout Ratio 60–85% oder stagnierende Dividende"],
                ["🔴 Gefährdet",  "Payout Ratio > 85% oder Dividendenkürzung"],
              ].map(([status, desc]) => (
                <div key={status} className="flex gap-2">
                  <span className="w-28 font-medium shrink-0">{status}</span>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Steuerhilfe */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">🇨🇭 Steuerliche Hinweise für Schweizer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            {stock.region === "CH" ? (
              <>
                <p><strong>Verrechnungssteuer:</strong> 35% werden automatisch abgezogen. Du kannst diese vollständig zurückfordern via Steuererklärung (Formular 86).</p>
                <p><strong>Tipp:</strong> Aktien müssen am Ex-Datum in deinem Depot sein — nicht verkaufen vor dem Ex-Datum.</p>
              </>
            ) : stock.region === "US" ? (
              <>
                <p><strong>Quellensteuer USA:</strong> 15% (bei CH-Ansässigen dank DBA). Wird direkt abgezogen.</p>
                <p><strong>Rückforderung:</strong> Die verbleibenden 15% können nur teilweise angerechnet werden. Faktische Belastung bleibt ~15%.</p>
              </>
            ) : stock.region === "EU" ? (
              <>
                <p><strong>Quellensteuer EU:</strong> Je nach Land 15–26.375% (z.B. Deutschland: 26.375%, Frankreich: 28%).</p>
                <p><strong>Rückforderung:</strong> Via DBA teilweise rückforderbar — Aufwand oft höher als Steuerersparnis bei kleinen Beträgen.</p>
              </>
            ) : (
              <p>Keine spezifischen Steuerhinweise für diese Region verfügbar.</p>
            )}
          </CardContent>
        </Card>

        {/* Dividend history */}
        {stock.dividends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dividendenhistorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stock.dividends.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="text-sm text-muted-foreground">
                      {new Date(d.exDate).toLocaleDateString("de-CH")}
                    </div>
                    <div className="font-mono font-semibold">
                      {new Intl.NumberFormat("de-CH", { style: "currency", currency: d.currency }).format(d.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
