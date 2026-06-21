// ─── Shared application types ─────────────────────────────────────────────────
// Single source of truth — import from here everywhere.

export type { Board, Metric, User } from "@prisma/client";

export interface BoardWithMetrics {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  isPublic: boolean;
  shareToken: string;
  createdAt: Date;
  updatedAt: Date;
  metrics: MetricRow[];
}

export interface MetricRow {
  id: string;
  boardId: string;
  name: string;
  value: number;
  unit: string | null;
  timestamp: Date;
  createdAt: Date;
}

export interface BoardSummary {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  shareToken: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { metrics: number };
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// SSE event payload sent to listeners
export interface SSEMetricEvent {
  type: "metric_added" | "metric_deleted" | "board_updated";
  boardId: string;
  payload: MetricRow | { id: string } | { name: string; description: string | null };
}
