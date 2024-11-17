export default function TabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="ml-2 p-2 h-9 w-9 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
