import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StockTable } from "@/components/StockTable";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import type { Stock } from "@/types/stock";

export const revalidate = 3600;

export default async function Home() {
  const stocks = (await prisma.stock.findMany({
    orderBy: { dividendYield: "desc" },
  })) as unknown as Stock[];

  const withYield = stocks.filter((s) => s.dividendYield !== null);
  const avgYield = withYield.length
    ? (withYield.reduce((a, s) => a + (s.dividendYield ?? 0), 0) / withYield.length).toFixed(2)
    : "—";
  const topYield = withYield[0]?.dividendYield?.toFixed(2) ?? "—";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">DividendWatch</h1>
              <p className="text-xs text-muted-foreground">Dividendenaktien für Kleinanleger im DACH-Raum</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/simulator" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors">
              📊 Simulator
            </Link>
            <Link href="/wachstum" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors">
              🚀 Wachstum
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Aktien gesamt", value: stocks.length.toString(), icon: "📊" },
            { label: "Ø Dividendenrendite", value: `${avgYield}%`, icon: "💰" },
            { label: "Höchste Rendite", value: `${topYield}%`, icon: "🏆" },
            { label: "Regionen", value: "CH · EU · US", icon: "🌍" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick-nav cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <Link href="/simulator" className="group bg-white rounded-xl border p-5 hover:border-primary/40 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Sparplan-Simulator</div>
            <div className="text-xs text-muted-foreground mt-1">DRIP-Berechnung mit Wachstumschart über bis zu 40 Jahre</div>
          </Link>
          <Link href="/wachstum" className="group bg-white rounded-xl border p-5 hover:border-primary/40 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Wachstumsaktien</div>
            <div className="text-xs text-muted-foreground mt-1">NVDA, MSFT, AMZN & Co. — Kapitalwachstum statt Dividende</div>
          </Link>
        </div>

        {/* Budget Calculator */}
        <BudgetCalculator stocks={stocks} />

        {/* Dividend Ranking */}
        <div>
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">🏆 Dividenden-Rangliste</h2>
            <span className="text-sm text-muted-foreground">{stocks.length} Aktien</span>
          </div>
          <StockTable stocks={stocks} />
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
          <strong>⚠️ Disclaimer:</strong> DividendWatch ist ein Informationswerkzeug und stellt keine Anlageberatung dar.
          Alle Daten dienen nur zu Informationszwecken. Investitionen in Aktien sind mit Risiken verbunden.
          Vergangene Renditen sind keine Garantie für zukünftige Ergebnisse.
        </div>
      </main>

      <footer className="border-t bg-white mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          DividendWatch · Open Source (MIT) · Daten via Yahoo Finance · Kein Anlageberatung
        </div>
      </footer>
    </div>
  );
}
