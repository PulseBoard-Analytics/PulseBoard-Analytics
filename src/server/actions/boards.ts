"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createBoardSchema,
  updateBoardSchema,
  type CreateBoardInput,
  type UpdateBoardInput,
} from "@/lib/validations";
import { broadcast } from "@/lib/sse";
import type { ActionResult, BoardSummary, BoardWithMetrics } from "@/lib/types";

async function requireUser(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createBoard(
  input: CreateBoardInput
): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUser();

  const parsed = createBoardSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const board = await db.board.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      isPublic: parsed.data.isPublic ?? false,
      ownerId: userId,
    },
    select: { id: true },
  });

  revalidatePath("/boards");
  return { success: true, data: { id: board.id } };
}

export async function updateBoard(
  boardId: string,
  input: UpdateBoardInput
): Promise<ActionResult<void>> {
  const userId = await requireUser();

  const board = await db.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) {
    return { success: false, error: "Board not found or access denied." };
  }

  const parsed = updateBoardSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const updated = await db.board.update({
    where: { id: boardId },
    data: {
      ...(parsed.data.name !== undefined && { name: parsed.data.name }),
      ...(parsed.data.description !== undefined && {
        description: parsed.data.description,
      }),
      ...(parsed.data.isPublic !== undefined && {
        isPublic: parsed.data.isPublic,
      }),
    },
  });

  broadcast(boardId, {
    type: "board_updated",
    boardId,
    payload: { name: updated.name, description: updated.description },
  });

  revalidatePath("/boards");
  revalidatePath(`/boards/${boardId}`);
  return { success: true, data: undefined };
}

export async function deleteBoard(
  boardId: string
): Promise<ActionResult<void>> {
  const userId = await requireUser();

  const board = await db.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) {
    return { success: false, error: "Board not found or access denied." };
  }

  await db.board.delete({ where: { id: boardId } });

  revalidatePath("/boards");
  return { success: true, data: undefined };
}

export async function getBoards(): Promise<BoardSummary[]> {
  const userId = await requireUser();

  return db.board.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      isPublic: true,
      shareToken: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { metrics: true } },
    },
  });
}

export async function getBoard(boardId: string): Promise<BoardWithMetrics | null> {
  const userId = await requireUser();

  const board = await db.board.findUnique({
    where: { id: boardId },
    include: {
      metrics: {
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (!board || board.ownerId !== userId) return null;
  return board;
}
