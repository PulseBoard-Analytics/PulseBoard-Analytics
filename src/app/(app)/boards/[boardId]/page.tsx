import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBoard } from "@/server/actions/boards";
import { BoardDashboard } from "@/components/boards/board-dashboard";
import { BoardDashboardSkeleton } from "@/components/boards/board-dashboard-skeleton";

interface Props {
  params: Promise<{ boardId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { boardId } = await params;
  const board = await getBoard(boardId);
  return { title: board?.name ?? "Board" };
}

export default async function BoardPage({ params }: Props) {
  const { boardId } = await params;

  return (
    <Suspense fallback={<BoardDashboardSkeleton />}>
      <BoardPageContent boardId={boardId} />
    </Suspense>
  );
}

async function BoardPageContent({ boardId }: { boardId: string }) {
  const board = await getBoard(boardId);
  if (!board) notFound();
  return <BoardDashboard board={board} />;
}
