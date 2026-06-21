import type { SSEMetricEvent } from "./types";

/**
 * In-process SSE broker.
 * Maps boardId → Set of active response controllers.
 * Works perfectly on Vercel Serverless (each instance is scoped to its request);
 * for multi-instance deployments swap this for Redis pub/sub.
 */
const listeners = new Map<string, Set<ReadableStreamDefaultController>>();

export function subscribe(
  boardId: string,
  controller: ReadableStreamDefaultController
): () => void {
  if (!listeners.has(boardId)) listeners.set(boardId, new Set());
  listeners.get(boardId)!.add(controller);

  // Return an unsubscribe function
  return () => {
    listeners.get(boardId)?.delete(controller);
    if (listeners.get(boardId)?.size === 0) listeners.delete(boardId);
  };
}

export function broadcast(boardId: string, event: SSEMetricEvent): void {
  const board = listeners.get(boardId);
  if (!board) return;

  const data = `data: ${JSON.stringify(event)}\n\n`;
  const encoder = new TextEncoder();
  const chunk = encoder.encode(data);

  for (const controller of board) {
    try {
      controller.enqueue(chunk);
    } catch {
      // Controller closed — remove it
      board.delete(controller);
    }
  }
}
