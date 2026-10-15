import { LogoutButton } from '@/app/components/logout-button';
export default function AnalyticsPage() {
  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <LogoutButton/>
      </header>
    </div>
  );
}