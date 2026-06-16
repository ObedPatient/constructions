interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-primary/80 overflow-hidden">
      <Skeleton className="h-56 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/4 mt-4" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="text-center py-8 px-6">
      <Skeleton className="w-12 h-12 mx-auto mb-4" />
      <Skeleton className="h-10 w-20 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  );
}
