import { Skeleton } from "@/components/ui/skeleton";

export function BoardsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card overflow-hidden">
          {/* accent strip */}
          <Skeleton className="h-1.5 w-full rounded-none" />
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <Skeleton className="h-3 w-1/3" />
            <div className="flex items-center justify-between pt-2 border-t">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
