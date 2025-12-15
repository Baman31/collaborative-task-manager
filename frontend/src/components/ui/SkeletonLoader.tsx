interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

export const SkeletonLoader = ({ count = 6, className = '' }: SkeletonLoaderProps) => {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-5 bg-gray-200 rounded w-16" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-20" />
    </div>
  </div>
);
