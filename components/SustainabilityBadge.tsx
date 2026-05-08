"use client";
import { Badge } from "@/components/ui/badge";
import type { SustainabilityStatus } from "@/types/stock";

const config: Record<SustainabilityStatus, { label: string; className: string }> = {
  green:  { label: "🟢 Nachhaltig",  className: "bg-green-100 text-green-800 border-green-200" },
  yellow: { label: "🟡 Prüfen",      className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  red:    { label: "🔴 Gefährdet",   className: "bg-red-100 text-red-800 border-red-200" },
};

export function SustainabilityBadge({ status }: { status: SustainabilityStatus | null }) {
  if (!status) return <Badge variant="outline" className="text-gray-400">—</Badge>;
  const { label, className } = config[status];
  return <Badge variant="outline" className={className}>{label}</Badge>;
}
