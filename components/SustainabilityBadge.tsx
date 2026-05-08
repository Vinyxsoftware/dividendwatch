"use client";
import type { SustainabilityStatus } from "@/types/stock";

const config: Record<SustainabilityStatus, { label: string; dot: string; pill: string }> = {
  green:  { label: "Nachhaltig", dot: "bg-emerald-400", pill: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  yellow: { label: "Prüfen",     dot: "bg-amber-400",   pill: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  red:    { label: "Gefährdet",  dot: "bg-red-400",     pill: "bg-red-400/10 text-red-400 border-red-400/20" },
};

export function SustainabilityBadge({ status }: { status: SustainabilityStatus | null }) {
  if (!status) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-white/5 text-muted-foreground border-white/10">
      —
    </span>
  );
  const { label, dot, pill } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
