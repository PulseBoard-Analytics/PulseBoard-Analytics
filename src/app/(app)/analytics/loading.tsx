import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="pb-2 border-b space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-5 space-y-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5 space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border p-5 space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
