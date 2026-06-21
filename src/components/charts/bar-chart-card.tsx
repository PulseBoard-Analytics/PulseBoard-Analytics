"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { MetricRow } from "@/lib/types";

// Teal-first palette
const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

interface BarChartCardProps {
  metrics: MetricRow[];
}

export function BarChartCard({ metrics }: BarChartCardProps) {
  const data = useMemo(() => {
    const byName = new Map<string, number>();
    for (const m of [...metrics].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )) {
      byName.set(m.name, m.value);
    }
    return Array.from(byName.entries())
      .map(([name, value]) => ({ name, value }))
      .slice(0, 12);
  }, [metrics]);

  if (data.length === 0) return null;

  return (
    <Card className="rounded-2xl border glass-card overflow-hidden">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          Latest values by metric
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(v: string) => v.length > 9 ? `${v.slice(0, 8)}…` : v}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip
              formatter={(v: number, name: string) => [formatNumber(v), name]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(9,9,11,0.9)",
                backdropFilter: "blur(12px)",
                color: "#f4f4f5",
              }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
