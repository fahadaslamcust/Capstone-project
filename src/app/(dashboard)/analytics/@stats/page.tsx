export default async function StatsPage() {
  await new Promise((r) => setTimeout(r, 2000));

  return (
    <div className="border p-4 rounded">
      Stats Widget
    </div>
  );
}