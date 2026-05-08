"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";

interface DataPoint {
  year: number;
  depotwert: number;
  einzahlungen: number;
  dividenden: number;
}

const fmtCHF = (v: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency", currency: "CHF", maximumFractionDigits: 0,
  }).format(v);

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  const names: Record<string, string> = {
    depotwert:    "Portfolio Value",
    einzahlungen: "Contributions",
    dividenden:   "Dividends (cumul.)",
  };

  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-xs space-y-1.5 min-w-[176px]">
      <div className="font-medium text-muted-foreground mb-2">Year {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            {names[p.name] ?? p.name}
          </span>
          <span className="font-data font-semibold text-foreground">{fmtCHF(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: { payload?: { value: string; color: string }[] }) {
  if (!payload) return null;
  const names: Record<string, string> = {
    depotwert:    "Portfolio Value (DRIP)",
    einzahlungen: "Contributions",
    dividenden:   "Cumulative Dividends",
  };
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-3">
      {payload.map((p) => (
        <div key={p.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {names[p.value] ?? p.value}
        </div>
      ))}
    </div>
  );
}

export function SimulatorChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="gradDepotwert" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#059669" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.00} />
          </linearGradient>
          <linearGradient id="gradEinzahlungen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.00} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(15,23,42,0.06)" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#64748b", fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `Y${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b", fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
            if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
            return v.toString();
          }}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Area type="monotone" dataKey="einzahlungen" stroke="#3b82f6" fill="url(#gradEinzahlungen)" strokeWidth={1.5} dot={false} />
        <Area type="monotone" dataKey="depotwert"    stroke="#059669" fill="url(#gradDepotwert)"    strokeWidth={2}   dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
