export function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded border bg-white p-4">
          <div className="h-5 w-2/3 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-full rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}