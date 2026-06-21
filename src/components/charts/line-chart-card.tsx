"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/utils";
import type { MetricRow } from "@/lib/types";

// Teal-first palette
const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

interface LineChartCardProps {
  metrics: MetricRow[];
}

export function LineChartCard({ metrics }: LineChartCardProps) {
  const { data, names } = useMemo(() => {
    const byDate = new Map<string, Record<string, number>>();
    const nameSet = new Set<string>();
    for (const m of metrics) {
      const date = formatDate(m.timestamp);
      if (!byDate.has(date)) byDate.set(date, { date: date as unknown as number });
      byDate.get(date)![m.name] = m.value;
      nameSet.add(m.name);
    }
    return { data: Array.from(byDate.values()), names: Array.from(nameSet).slice(0, 6) };
  }, [metrics]);

  if (data.length === 0) return null;

  const isSingle = names.length === 1;

  return (
    <Card className="rounded-2xl border glass-card overflow-hidden">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          Trend over time
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          {isSingle ? (
            <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatNumber(v)}
              />
              <Tooltip
                formatter={(v: number) => [formatNumber(v), names[0]]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(9,9,11,0.9)",
                  backdropFilter: "blur(12px)",
                  color: "#f4f4f5",
                }}
                cursor={{ stroke: "#14b8a6", strokeWidth: 1, strokeDasharray: "4 2" }}
              />
              <Area
                type="monotone"
                dataKey={names[0]}
                stroke="#14b8a6"
                strokeWidth={2.5}
                fill="url(#tealGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#14b8a6", stroke: "#09090b", strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
                tickLine={false}
                axisLine={false}
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
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              {names.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
