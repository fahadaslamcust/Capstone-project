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
    <div>
      {children}

      <div className="grid grid-cols-2 gap-4 mt-6">
        {stats}
        {activity}
      </div>
    </div>
  );
}
