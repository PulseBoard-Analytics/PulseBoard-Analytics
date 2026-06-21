"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { deleteMetric } from "@/server/actions/metrics";
import { formatDate, formatNumber } from "@/lib/utils";
import { Trash2, Table2 } from "lucide-react";
import type { MetricRow } from "@/lib/types";

interface MetricsTableProps {
  metrics: MetricRow[];
  boardId: string;
  onDeleted: (id: string) => void;
}

export function MetricsTable({ metrics, boardId, onDeleted }: MetricsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteMetric(deleteId, boardId);
      if (result.success) {
        onDeleted(deleteId);
        toast({ title: "Metric deleted" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const sorted = [...metrics].reverse();

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">All Metrics</h2>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 tabular-nums">
            {metrics.length}
          </span>
        </div>

        <div className="rounded-2xl border overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unit</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((metric) => (
                  <tr
                    key={metric.id}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors group"
                  >
                    <td className="px-5 py-3.5 font-medium">{metric.name}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-primary">
                      {formatNumber(metric.value)}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {metric.unit ? (
                        <span className="bg-muted rounded-md px-1.5 py-0.5 font-mono">{metric.unit}</span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {formatDate(metric.timestamp)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                        aria-label={`Delete ${metric.name}`}
                        onClick={() => setDeleteId(metric.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this metric?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
