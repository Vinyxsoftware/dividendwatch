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
  return (
    <div className="rounded-xl border border-white/12 bg-[#0d1525]/95 backdrop-blur-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[180px]">
      <div className="font-data font-semibold text-muted-foreground mb-2">Jahr {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {p.name === "depotwert" ? "Depotwert" : p.name === "einzahlungen" ? "Einzahlungen" : "Dividenden kum."}
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
    depotwert:    "Depotwert (mit DRIP)",
    einzahlungen: "Einzahlungen",
    dividenden:   "Kumulierte Dividenden",
  };
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-3">
      {payload.map((p) => (
        <div key={p.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: p.color }} />
          {names[p.value] ?? p.value}
        </div>
      ))}
    </div>
  );
}

export function SimulatorChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="gradDepotwert" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#34d399" stopOpacity={0.20} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0.00} />
          </linearGradient>
          <linearGradient id="gradEinzahlungen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.00} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#50617a", fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `J${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#50617a", fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
            if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
            return v.toString();
          }}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Area
          type="monotone"
          dataKey="einzahlungen"
          stroke="#38bdf8"
          fill="url(#gradEinzahlungen)"
          strokeWidth={1.5}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="depotwert"
          stroke="#34d399"
          fill="url(#gradDepotwert)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
