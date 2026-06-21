"use client";

import { useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import type { MetricRow } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiTilesProps {
  metrics: MetricRow[];
}

interface KpiStat {
  name: string;
  latest: number;
  unit: string | null;
  change: number | null;
}

function buildKpis(metrics: MetricRow[]): KpiStat[] {
  const byName = new Map<string, MetricRow[]>();
  for (const m of metrics) {
    if (!byName.has(m.name)) byName.set(m.name, []);
    byName.get(m.name)!.push(m);
  }
  const stats: KpiStat[] = [];
  for (const [name, rows] of byName) {
    const sorted = [...rows].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
    const change =
      previous && previous.value !== 0
        ? ((latest.value - previous.value) / Math.abs(previous.value)) * 100
        : null;
    stats.push({ name, latest: latest.value, unit: latest.unit, change });
  }
  return stats.slice(0, 8);
}

export function KpiTiles({ metrics }: KpiTilesProps) {
  const kpis = useMemo(() => buildKpis(metrics), [metrics]);
  if (kpis.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <KpiTile key={kpi.name} kpi={kpi} index={i} />
      ))}
    </div>
  );
}

function KpiTile({ kpi, index }: { kpi: KpiStat; index: number }) {
  const isPositive = kpi.change !== null && kpi.change > 0;
  const isNegative = kpi.change !== null && kpi.change < 0;

  // Subtle teal tint on first tile, muted on rest
  const isFirst = index === 0;

  return (
    <div className={`
      relative rounded-2xl p-5 overflow-hidden
      border transition-all duration-200
      hover:border-primary/30 group
      glass-card
      ${isFirst
        ? "border-primary/25 dark:border-primary/20"
        : "border-border"}
    `}>
      {/* Teal ambient glow on first tile */}
      {isFirst && (
        <div className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none" />
      )}

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isFirst ? "bg-primary/60" : "bg-border"}`} />

      <div className="relative space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground line-clamp-1">
          {kpi.name}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black tabular-nums leading-none tracking-tight ${isFirst ? "text-primary" : "text-foreground"}`}>
            {formatNumber(kpi.latest)}
          </span>
          {kpi.unit && (
            <span className="text-xs font-medium text-muted-foreground">{kpi.unit}</span>
          )}
        </div>

        {kpi.change !== null ? (
          <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : isNegative
              ? "bg-red-500/10 text-red-400"
              : "bg-muted text-muted-foreground"
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {isPositive ? "+" : ""}{Math.abs(kpi.change).toFixed(1)}%
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground">baseline</span>
        )}
      </div>
    </div>
  );
}
