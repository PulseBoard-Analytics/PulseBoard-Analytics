"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { KpiTiles } from "@/components/charts/kpi-tiles";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { Globe, WifiOff, BarChart3 } from "lucide-react";
import type { MetricRow, SSEMetricEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ShareBoard {
  id: string;
  name: string;
  description: string | null;
  shareToken: string;
  metrics: MetricRow[];
  owner: { name: string | null };
}

interface ShareDashboardProps {
  board: ShareBoard;
  token: string;
}

export function ShareDashboard({ board: initialBoard, token }: ShareDashboardProps) {
  const [metrics, setMetrics] = useState<MetricRow[]>(initialBoard.metrics);
  const [boardName, setBoardName] = useState(initialBoard.name);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource(
      `/api/boards/${initialBoard.id}/stream?token=${encodeURIComponent(token)}`
    );
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as SSEMetricEvent;
      if (data.type === "metric_added") {
        const metric = data.payload as MetricRow;
        setMetrics((prev) => {
          if (prev.find((m) => m.id === metric.id)) return prev;
          return [...prev, metric].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
      } else if (data.type === "metric_deleted") {
        const { id } = data.payload as { id: string };
        setMetrics((prev) => prev.filter((m) => m.id !== id));
      } else if (data.type === "board_updated") {
        const update = data.payload as { name: string };
        setBoardName(update.name);
      }
    };
    return () => es.close();
  }, [initialBoard.id, token]);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight">{boardName}</h1>
            <Badge className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold gap-1 border text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800">
              <Globe className="h-2.5 w-2.5" />
              Public
            </Badge>
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border",
              connected
                ? "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800"
                : "text-muted-foreground bg-muted/50 border-border"
            )}>
              {connected
                ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live</>
                : <><WifiOff className="h-3 w-3" />Connecting…</>
              }
            </div>
          </div>
          {initialBoard.description && (
            <p className="text-sm text-muted-foreground">{initialBoard.description}</p>
          )}
          {initialBoard.owner.name && (
            <p className="text-xs text-muted-foreground">
              Shared by <span className="font-medium text-foreground">{initialBoard.owner.name}</span>
            </p>
          )}
        </div>
      </div>

      <KpiTiles metrics={metrics} />

      {metrics.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LineChartCard metrics={metrics} />
          <BarChartCard metrics={metrics} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-16 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No metrics yet</p>
        </div>
      )}
    </div>
  );
}
