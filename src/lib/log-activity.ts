import { db } from "@/db";
import { activityLogs } from "@/db/schema";

export async function logActivity(
	userId: string,
	action: "PROJECT_CREATED" | "PROJECT_UPDATED" | "PROJECT_ARCHIVED",
	projectId: string
) {
	await db.insert(activityLogs).values({
		id: crypto.randomUUID(),
		action,
		entityType: "project",
		entityId: projectId,
		userId,
		createdAt: new Date()
	});
}
