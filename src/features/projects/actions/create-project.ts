"use server";
import { revalidatePath } from "next/cache";
import { createProjectInD1 } from "@/lib/d1-worker";
import { getCurrentUser } from "@/lib/dal/auth";
import { logInfo } from "@/lib/log";
import { CreateProjectSchema } from "../schemas/project";

export async function createProjectAction(
	_prevState: unknown,
	formData: FormData,
) {
	logInfo("create-project called");
	const user = await getCurrentUser();

	if (!user) {
		return { error: "Unauthorized" };
	}

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

	await createProjectInD1({
		name: parsed.data.name,
		description: parsed.data.description ?? null,
		organizationId: user.organization_id,
		createdById: user.id,
	});

	revalidatePath("/projects");
	revalidatePath("/analytics");

	return { success: true };
}
