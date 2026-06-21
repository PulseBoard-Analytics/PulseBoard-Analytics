"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AddMetricDialog } from "@/components/metrics/add-metric-dialog";
import { ImportCsvDialog } from "@/components/metrics/import-csv-dialog";
import { MetricsTable } from "@/components/metrics/metrics-table";
import { KpiTiles } from "@/components/charts/kpi-tiles";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import type { BoardWithMetrics, MetricRow, SSEMetricEvent } from "@/lib/types";
import { Copy, Globe, Lock, Settings2, BarChart3 } from "lucide-react";
import { EditBoardDialog } from "./edit-board-dialog";
import type { BoardSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BoardDashboardProps {
  board: BoardWithMetrics;
}

export function BoardDashboard({ board: initialBoard }: BoardDashboardProps) {
  const [metrics, setMetrics] = useState<MetricRow[]>(initialBoard.metrics);
  const [board, setBoard] = useState(initialBoard);
  const [connected, setConnected] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const es = new EventSource(`/api/boards/${board.id}/stream`);
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as SSEMetricEvent;
      if (data.type === "metric_added") {
        const metric = data.payload as MetricRow;
        setMetrics((prev) => {
          if (prev.find((m) => m.id === metric.id)) return prev;
          return [...prev, metric].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        });
      } else if (data.type === "metric_deleted") {
        const { id } = data.payload as { id: string };
        setMetrics((prev) => prev.filter((m) => m.id !== id));
      } else if (data.type === "board_updated") {
        const update = data.payload as { name: string; description: string | null };
        setBoard((prev) => ({ ...prev, ...update }));
      }
    };
    return () => es.close();
  }, [board.id]);

  const handleMetricAdded = useCallback((metric: MetricRow) => {
    setMetrics((prev) => {
      if (prev.find((m) => m.id === metric.id)) return prev;
      return [...prev, metric].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
  }, []);

  const handleMetricDeleted = useCallback((metricId: string) => {
    setMetrics((prev) => prev.filter((m) => m.id !== metricId));
  }, []);

  const handleImported = useCallback((count: number) => {
    toast({ title: `Imported ${count} metrics successfully` });
    window.location.reload();
  }, []);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${board.shareToken}`
    : "";

  const boardAsSummary: BoardSummary = {
    id: board.id,
    name: board.name,
    description: board.description,
    isPublic: board.isPublic,
    shareToken: board.shareToken,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
    _count: { metrics: metrics.length },
  };

  return (
    <div className="space-y-7">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight truncate">{board.name}</h1>

            {/* Visibility badge */}
            <Badge
              className={cn(
                "text-[10px] px-2.5 py-0.5 rounded-full font-semibold gap-1 border",
                board.isPublic
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800"
                  : "text-muted-foreground bg-muted/50 border-border"
              )}
            >
              {board.isPublic ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
              {board.isPublic ? "Public" : "Private"}
            </Badge>

            {/* Live indicator */}
            <div
              title={connected ? "Live updates connected" : "Reconnecting…"}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border",
                connected
                  ? "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800"
                  : "text-muted-foreground bg-muted/50 border-border"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
              {connected ? "Live" : "Connecting…"}
            </div>
          </div>

          {board.description && (
            <p className="text-sm text-muted-foreground max-w-xl">{board.description}</p>
          )}

          <p className="text-xs text-muted-foreground tabular-nums">
            {metrics.length} metric{metrics.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {board.isPublic && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5 text-xs h-8"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast({ title: "Share link copied!" });
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Share
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5 text-xs h-8"
            onClick={() => setEditOpen(true)}
          >
            <Settings2 className="h-3.5 w-3.5" />
            Settings
          </Button>
          <ImportCsvDialog boardId={board.id} onImported={handleImported} />
          <AddMetricDialog boardId={board.id} onAdded={handleMetricAdded} />
        </div>
      </div>

      {/* ── KPI tiles ── */}
      <KpiTiles metrics={metrics} />

      {/* ── Charts ── */}
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
          <p className="text-sm font-medium">No metrics yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add a metric or import a CSV to see your charts</p>
        </div>
      )}

      {/* ── Data table ── */}
      {metrics.length > 0 && (
        <div className="pt-2">
          <MetricsTable metrics={metrics} boardId={board.id} onDeleted={handleMetricDeleted} />
        </div>
      )}

      <EditBoardDialog board={boardAsSummary} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
