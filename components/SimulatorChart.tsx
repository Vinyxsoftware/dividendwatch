"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface DataPoint {
  year: number;
  depotwert: number;
  einzahlungen: number;
  dividenden: number;
}

export function SimulatorChart({ data }: { data: DataPoint[] }) {
  const fmtCHF = (v: number) =>
    new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(v);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <defs>
          <linearGradient id="gradDepotwert" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradEinzahlungen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(v) => `Jahr ${v}`} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => fmtCHF(v)} width={90} />
        <Tooltip
          formatter={(value, name) => [
            fmtCHF(Number(value)),
            name === "depotwert" ? "Depotwert" : name === "einzahlungen" ? "Einzahlungen" : "Kumulierte Dividenden",
          ]}
          labelFormatter={(label) => `Jahr ${label}`}
        />
        <Legend formatter={(v) =>
          v === "depotwert" ? "Depotwert (mit DRIP)" : v === "einzahlungen" ? "Einzahlungen" : "Kumulierte Dividenden"
        } />
        <Area type="monotone" dataKey="einzahlungen" stroke="#10B981" fill="url(#gradEinzahlungen)" strokeWidth={2} />
        <Area type="monotone" dataKey="depotwert"    stroke="#4F46E5" fill="url(#gradDepotwert)"    strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
