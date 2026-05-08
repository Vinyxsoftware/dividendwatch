import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { StockTable } from "@/components/StockTable";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { BarChart2, Percent, Trophy, Globe, Rocket, ArrowRight } from "lucide-react";
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

  const stats = [
    { label: "Aktien gesamt",       value: stocks.length.toString(), icon: BarChart2, accent: false },
    { label: "Ø Dividendenrendite", value: `${avgYield}%`,           icon: Percent,  accent: false },
    { label: "Höchste Rendite",     value: `${topYield}%`,           icon: Trophy,   accent: true },
    { label: "Regionen",            value: "CH · EU · US",           icon: Globe,    accent: false },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* Hero */}
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            Dividendenaktien<br className="sm:hidden" />{" "}
            <span className="text-primary">im Überblick</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Rangliste, Budgetrechner und Nachhaltigkeits-Check — speziell für Kleinanleger im DACH-Raum.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 transition-all ${
                accent
                  ? "border-primary/25 bg-primary/[0.05] glow-green-sm"
                  : "border-white/8 bg-white/[0.03]"
              }`}
            >
              <Icon className={`w-4 h-4 mb-3 ${accent ? "text-primary" : "text-muted-foreground"}`} />
              <div className={`text-2xl font-data font-bold ${accent ? "text-primary" : "text-foreground"}`}>
                {value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/simulator"
            className="group rounded-xl border border-white/8 bg-white/[0.03] p-5 hover:border-primary/25 hover:bg-primary/[0.04] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <BarChart2 className="w-4 h-4 text-primary" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              Sparplan-Simulator
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">
              DRIP-Berechnung mit Wachstumschart über bis zu 40 Jahre
            </div>
          </Link>

          <Link
            href="/wachstum"
            className="group rounded-xl border border-white/8 bg-white/[0.03] p-5 hover:border-sky-400/25 hover:bg-sky-400/[0.04] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center group-hover:bg-sky-400/15 transition-colors">
                <Rocket className="w-4 h-4 text-sky-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-display font-semibold text-foreground group-hover:text-sky-400 transition-colors">
              Wachstumsaktien
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">
              NVDA, MSFT, AMZN & Co. — Kapitalwachstum statt Dividende
            </div>
          </Link>
        </div>

        {/* Budget Calculator */}
        <BudgetCalculator stocks={stocks} />

        {/* Ranking */}
        <div>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-display font-semibold text-xl text-foreground">Dividenden-Rangliste</h2>
            <span className="text-sm text-muted-foreground">{stocks.length} Aktien</span>
          </div>
          <StockTable stocks={stocks} />
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4 text-sm text-amber-400/80">
          DividendWatch ist ein Informationswerkzeug — keine Anlageberatung. Alle Daten dienen nur zu Informationszwecken. Investitionen in Aktien sind mit Risiken verbunden.
        </div>
      </main>

      <footer className="border-t border-white/[0.06] mt-auto py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-display">
            Dividend<span className="text-primary">Watch</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Open Source · MIT · Daten via Yahoo Finance · Keine Anlageberatung
          </span>
        </div>
      </footer>
    </div>
  );
}
