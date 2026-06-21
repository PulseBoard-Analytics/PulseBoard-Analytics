"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { formatNumber, formatDate } from "@/lib/utils";
import { BarChart3, TrendingUp, Database, Activity } from "lucide-react";

interface RecentMetric {
  id: string;
  name: string;
  value: number;
  unit: string | null;
  createdAt: Date;
  board: { name: string };
}

interface AnalyticsViewProps {
  totalBoards: number;
  totalMetrics: number;
  recentMetrics: RecentMetric[];
}

export function AnalyticsView({ totalBoards, totalMetrics, recentMetrics }: AnalyticsViewProps) {
  // Group metrics by day for the area chart
  const activityData = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const m of recentMetrics) {
      const day = formatDate(m.createdAt);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    return Array.from(byDay.entries()).map(([date, count]) => ({ date, count })).slice(-14);
  }, [recentMetrics]);

  // Top metrics by frequency
  const topMetrics = useMemo(() => {
    const freq = new Map<string, number>();
    for (const m of recentMetrics) freq.set(m.name, (freq.get(m.name) ?? 0) + 1);
    return Array.from(freq.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [recentMetrics]);

  const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your metric activity</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BarChart3,   label: "Total Boards",   value: totalBoards,  color: "text-primary bg-primary/10 border-primary/20" },
          { icon: Database,    label: "Total Metrics",  value: totalMetrics, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
          { icon: TrendingUp,  label: "Last 50 Added",  value: recentMetrics.length, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
          { icon: Activity,    label: "Avg per Board",  value: totalBoards > 0 ? Math.round(totalMetrics / totalBoards) : 0, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border glass-card p-5 space-y-3">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border ${color}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-3xl font-black tabular-nums">{formatNumber(value)}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity over time */}
        <div className="rounded-2xl border glass-card p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Metric activity (last 14 days)
          </h2>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(9,9,11,0.9)", color: "#f4f4f5" }}
                  formatter={(v: number) => [v, "metrics added"]}
                />
                <Area type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={2.5} fill="url(#actGrad)" dot={false} activeDot={{ r: 4, fill: "#14b8a6", stroke: "#09090b", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No activity yet</div>
          )}
        </div>

        {/* Top metrics */}
        <div className="rounded-2xl border glass-card p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Most tracked metrics
          </h2>
          {topMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topMetrics} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }} tickLine={false} axisLine={false} tickFormatter={(v: string) => v.length > 8 ? `${v.slice(0, 7)}…` : v} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(9,9,11,0.9)", color: "#f4f4f5" }}
                  formatter={(v: number) => [v, "entries"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {topMetrics.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No metrics yet</div>
          )}
        </div>
      </div>

      {/* Recent activity table */}
      <div className="rounded-2xl border glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="text-sm font-semibold">Recent metrics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Metric</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Board</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Added</th>
              </tr>
            </thead>
            <tbody>
              {recentMetrics.slice(0, 10).map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3 font-medium">{m.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-bold text-primary">
                    {formatNumber(m.value)}{m.unit ? ` ${m.unit}` : ""}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{m.board.name}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{formatDate(m.createdAt)}</td>
                </tr>
              ))}
              {recentMetrics.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No metrics yet. Add some from your boards.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
