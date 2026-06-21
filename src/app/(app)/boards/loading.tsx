import { BoardsListSkeleton } from "@/components/boards/boards-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BoardsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <BoardsListSkeleton />
    </div>
  );
}
