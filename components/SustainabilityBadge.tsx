"use client";
import type { SustainabilityStatus } from "@/types/stock";

const config: Record<SustainabilityStatus, { label: string; dot: string; pill: string }> = {
  green:  { label: "Sustainable", dot: "bg-emerald-600", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  yellow: { label: "Review",      dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-700 border-amber-200" },
  red:    { label: "At Risk",     dot: "bg-red-500",     pill: "bg-red-50 text-red-600 border-red-200" },
};

export function SustainabilityBadge({ status }: { status: SustainabilityStatus | null }) {
  if (!status) return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
      —
    </span>
  );
  const { label, dot, pill } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}
