export default function AnalyticsLayout({
  children,
  stats,
  activity,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div className="px-6 py-8">
      {children}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {stats}
        {activity}
      </div>
    </div>
  );
}
