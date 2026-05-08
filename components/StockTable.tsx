"use client";
import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SustainabilityBadge } from "./SustainabilityBadge";
import type { Stock } from "@/types/stock";

function fmt(v: number | null, decimals = 2, suffix = "") {
  if (v === null) return "—";
  return `${v.toFixed(decimals)}${suffix}`;
}

function fmtPrice(price: number | null, currency: string) {
  if (price === null) return "—";
  return new Intl.NumberFormat("de-CH", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
}

export function StockTable({ stocks }: { stocks: Stock[] }) {
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("dividendYield");

  const filtered = stocks
    .filter((s) => region === "all" || s.region === region)
    .sort((a, b) => {
      if (sort === "dividendYield") return (b.dividendYield ?? 0) - (a.dividendYield ?? 0);
      if (sort === "price") return (a.currentPrice ?? 9999) - (b.currentPrice ?? 9999);
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={region} onValueChange={(v) => { if (v) setRegion(v); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Regionen</SelectItem>
            <SelectItem value="CH">🇨🇭 Schweiz</SelectItem>
            <SelectItem value="EU">🇪🇺 Europa</SelectItem>
            <SelectItem value="US">🇺🇸 USA</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => { if (v) setSort(v); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sortierung" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dividendYield">Höchste Rendite</SelectItem>
            <SelectItem value="price">Günstigster Preis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-24">Ticker</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Kurs</TableHead>
              <TableHead className="text-right">Dividende/Jahr</TableHead>
              <TableHead className="text-right">Rendite</TableHead>
              <TableHead className="text-right">Payout</TableHead>
              <TableHead>Nachhaltigkeit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  Keine Aktien gefunden.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((s) => (
              <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Link href={`/stock/${encodeURIComponent(s.ticker)}`} className="font-mono font-semibold text-primary text-sm hover:underline">
                    {s.ticker}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.exchange} · {s.region}</div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {fmtPrice(s.currentPrice, s.currency)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {s.annualDividend ? fmtPrice(s.annualDividend, s.currency) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {s.dividendYield !== null ? (
                    <span className={`font-bold text-sm ${s.dividendYield >= 4 ? "text-green-600" : s.dividendYield >= 2 ? "text-blue-600" : "text-muted-foreground"}`}>
                      {fmt(s.dividendYield)}%
                    </span>
                  ) : "—"}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {fmt(s.payoutRatio)}%
                </TableCell>
                <TableCell>
                  <SustainabilityBadge status={s.sustainabilityStatus as never} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
