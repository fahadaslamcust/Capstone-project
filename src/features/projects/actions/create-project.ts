"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { activityLogs, projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal/auth";
import { CreateProjectSchema } from "../schemas/project";

export async function createProjectAction(prevState: any, formData: FormData) {
	const user = await getCurrentUser();
	if (!user) return { error: "Unauthorized" };

	const parsed = CreateProjectSchema.safeParse({
		name: formData.get("name"),
		description: formData.get("description"),
	});

	if (!parsed.success) {
		return {
			error: "Validation failed",
			fieldErrors: parsed.error.flatten().fieldErrors,
		};
	}

	const projectId = crypto.randomUUID();
	const now = new Date();

	// better-sqlite3 transactions are synchronous: no async callback, no await, .run() on each query.
	// If either insert throws, both are rolled back.
	db.transaction((tx) => {
		tx.insert(projects)
			.values({
				id: projectId,
				name: parsed.data.name,
				description: parsed.data.description,
				organizationId: user.organization_id,
				createdById: user.id,
				createdAt: now,
				updatedAt: now,
				status: "active",
			})
			.run();

		tx.insert(activityLogs)
			.values({
				id: crypto.randomUUID(),
				action: "PROJECT_CREATED",
				entityType: "project",
				entityId: projectId,
				userId: user.id,
				createdAt: now,
			})
			.run();
	});

	revalidatePath("/projects");
	revalidatePath("/analytics");
	return { success: true };
}
