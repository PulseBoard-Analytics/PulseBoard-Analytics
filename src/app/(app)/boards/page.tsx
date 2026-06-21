import type { Metadata } from "next";
import { Suspense } from "react";
import { getBoards } from "@/server/actions/boards";
import { BoardsList } from "@/components/boards/boards-list";
import { CreateBoardButton } from "@/components/boards/create-board-button";
import { BoardsListSkeleton } from "@/components/boards/boards-list-skeleton";

export const metadata: Metadata = { title: "My Boards" };

export default function BoardsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Boards</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build and manage your real-time analytics dashboards
          </p>
        </div>
        <CreateBoardButton />
      </div>

      <Suspense fallback={<BoardsListSkeleton />}>
        <BoardsListServer />
      </Suspense>
    </div>
  );
}

async function BoardsListServer() {
  const boards = await getBoards();
  return <BoardsList boards={boards} />;
}
