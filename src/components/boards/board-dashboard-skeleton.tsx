import { Skeleton } from "@/components/ui/skeleton";

export function BoardDashboardSkeleton() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-2">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border bg-card overflow-hidden">
            <div className="px-5 pt-5 pb-2 flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="px-2 pb-4">
              <Skeleton className="h-60 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
