import { and, eq, like } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";

export async function getFilteredProjects(
	orgId: string,
	query: string,
	status: string,
) {
	"use cache";

	const filters = [eq(projects.organizationId, orgId)];

	if (query) {
		filters.push(like(projects.name, `%${query}%`));
	}

	if (status) {
		filters.push(eq(projects.status, status));
	}

	return await db
		.select()
		.from(projects)
		.where(and(...filters));
}
