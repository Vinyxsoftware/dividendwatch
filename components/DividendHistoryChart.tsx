"use client";
import { useTheme } from "next-themes";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DividendPoint {
  id: string;
  exDate: Date | string;
  amount: number;
  currency: string;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; payload: DividendPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const formatter = new Intl.NumberFormat("de-CH", { style: "currency", currency: point.currency });
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-xs space-y-1 min-w-[140px]">
      <div className="font-medium text-muted-foreground">{label}</div>
      <div className="font-data font-semibold text-foreground">{formatter.format(point.amount)}</div>
    </div>
  );
}

export function DividendHistoryChart({ dividends }: { dividends: DividendPoint[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const tickFill = isDark ? "#94a3b8" : "#64748b";
  const gridStroke = isDark ? "rgba(226,232,240,0.08)" : "rgba(15,23,42,0.06)";

  if (dividends.length < 2) return null;

  const data = [...dividends]
    .sort((a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime())
    .map((d) => ({
      ...d,
      label: new Date(d.exDate).toLocaleDateString("en-CH", { year: "2-digit", month: "short" }),
    }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke={gridStroke} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: tickFill, fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 10, fill: tickFill, fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={false}
          width={40}
          domain={[0, (max: number) => Number((max * 1.2).toFixed(2))]}
          tickFormatter={(v: number) => v.toFixed(2)}
          allowDecimals
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} dot={{ r: 2.5, fill: "#059669" }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
