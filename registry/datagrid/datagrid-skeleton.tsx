interface DataGridSkeletonProps {
  rows?: number;
}

export function DataGridSkeleton({ rows = 10 }: DataGridSkeletonProps) {
  return (
    <div className="panel">
      {/* Search skeleton */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="h-10 w-80 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="space-y-3">
        {/* Header skeleton */}
        <div className="flex gap-4 border-b pb-3">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
