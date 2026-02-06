import { Skeleton } from "@/components/ui/skeleton";

export function TagsTableSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="bg-table-header px-4 py-3 border-b">
        <div className="grid grid-cols-[1fr_100px_100px_120px_120px_120px_50px] gap-4">
          {["w-24", "w-16", "w-20", "w-20", "w-16", "w-20", "w-8"].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="px-4 py-3.5 border-b last:border-0">
          <div className="grid grid-cols-[1fr_100px_100px_120px_120px_120px_50px] gap-4 items-center">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
