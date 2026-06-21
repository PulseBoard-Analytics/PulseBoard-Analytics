"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addMetricSchema, type AddMetricInput } from "@/lib/validations";
import { parseCsvText } from "@/lib/csv";
import { broadcast } from "@/lib/sse";
import type { ActionResult, MetricRow } from "@/lib/types";

async function requireBoardAccess(boardId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const board = await db.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== session.user.id) {
    throw new Error("Board not found or access denied");
  }
}

export async function addMetric(
  input: AddMetricInput
): Promise<ActionResult<MetricRow>> {
  const parsed = addMetricSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await requireBoardAccess(parsed.data.boardId);

  const metric = await db.metric.create({
    data: {
      boardId: parsed.data.boardId,
      name: parsed.data.name,
      value: parsed.data.value,
      unit: parsed.data.unit ?? null,
      timestamp: parsed.data.timestamp ?? new Date(),
    },
  });

  broadcast(parsed.data.boardId, {
    type: "metric_added",
    boardId: parsed.data.boardId,
    payload: metric,
  });

  revalidatePath(`/boards/${parsed.data.boardId}`);
  return { success: true, data: metric };
}

export async function deleteMetric(
  metricId: string,
  boardId: string
): Promise<ActionResult<void>> {
  await requireBoardAccess(boardId);

  await db.metric.delete({ where: { id: metricId } });

  broadcast(boardId, {
    type: "metric_deleted",
    boardId,
    payload: { id: metricId },
  });

  revalidatePath(`/boards/${boardId}`);
  return { success: true, data: undefined };
}

export async function importCsvMetrics(
  boardId: string,
  csvText: string
): Promise<ActionResult<{ count: number }>> {
  await requireBoardAccess(boardId);

  const { rows, errors } = parseCsvText(csvText);
  if (errors.length > 0) {
    return {
      success: false,
      error: `CSV parse errors:\n${errors.slice(0, 5).join("\n")}`,
    };
  }

  const metrics = await db.$transaction(
    rows.map((row) =>
      db.metric.create({
        data: {
          boardId,
          name: row.name,
          value: row.value,
          unit: row.unit ?? null,
          timestamp: row.timestamp ?? new Date(),
        },
      })
    )
  );

  // Broadcast all new metrics
  for (const metric of metrics) {
    broadcast(boardId, {
      type: "metric_added",
      boardId,
      payload: metric,
    });
  }

  revalidatePath(`/boards/${boardId}`);
  return { success: true, data: { count: metrics.length } };
}
