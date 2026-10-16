import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal/auth";

export default async function StatsPage() {
	const user = await getCurrentUser();
	if (!user) return null;
	const rows = await db
		.select({ status: projects.status, total: count() })
		.from(projects)
		.where(eq(projects.organizationId, user.organization_id))
		.groupBy(projects.status);
	const byStatus = Object.fromEntries(rows.map((r) => [r.status, r.total]));
	const active = byStatus.active ?? 0;
	const archived = byStatus.archived ?? 0;
	return (
		<div className="rounded border p-4">
			<h2 className="mb-3 font-semibold">Project stats</h2>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div className="rounded border p-3">
					<p className="text-xs text-gray-500">Total</p>
					<p className="text-2xl font-bold">{active + archived}</p>
				</div>
				<div className="rounded border p-3">
					<p className="text-xs text-gray-500">Active</p>
					<p className="text-2xl font-bold">{active}</p>
				</div>
				<div className="rounded border p-3">
					<p className="text-xs text-gray-500">Archived</p>
					<p className="text-2xl font-bold">{archived}</p>
				</div>
			</div>
		</div>
	);
}
