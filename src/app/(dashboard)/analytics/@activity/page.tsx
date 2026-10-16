import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs, projects, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal/auth";

const ACTION_LABELS: Record<string, string> = {
	PROJECT_CREATED: "created",
	PROJECT_UPDATED: "updated",
	PROJECT_ARCHIVED: "archived",
};
export default async function ActivityPage() {
	const user = await getCurrentUser();
	if (!user) return null;

	const rows = await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			createdAt: activityLogs.createdAt,
			userName: users.name,
			projectName: projects.name,
		})
		.from(activityLogs)
		.innerJoin(users, eq(activityLogs.userId, users.id))
		.leftJoin(projects, eq(activityLogs.entityId, projects.id))
		.where(
			and(
				eq(users.organizationId, user.organization_id),
				eq(activityLogs.entityType, "project"),
			),
		)
		.orderBy(desc(activityLogs.createdAt))
		.limit(5);

	return (
		<div className="rounded border p-4">
			<h2 className="mb-3 font-semibold">Recent activity</h2>
			{rows.length === 0 ? (
				<p className="text-sm text-gray-500">No activity yet.</p>
			) : (
				<ul className="space-y-3">
					{rows.map((r) => (
						<li key={r.id} className="text-sm">
							<p>
								<span className="font-medium">{r.userName}</span>{" "}
								{ACTION_LABELS[r.action] ?? r.action} project{" "}
								<span className="font-medium">
									“{r.projectName ?? "deleted project"}”
								</span>
							</p>
							<p className="text-xs text-gray-500">
								{r.createdAt.toLocaleString()}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
