"use server";
import { logInfo } from "@/lib/log";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal/auth";
import { updateProjectInD1 } from "@/lib/d1-worker";
import {
  UpdateProjectSchema,
  type UpdateProjectState,
} from "../schemas/project";

export async function updateProjectAction(
  prevState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  logInfo("update-project called");
  const user = await getCurrentUser();

  if (!user) return { error: "Unauthorized" };

  const parsed = UpdateProjectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateProjectInD1({
      projectId: parsed.data.id,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      organizationId: user.organization_id,
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("(404)")) {
      return { error: "Project not found" };
    }

    return { error: "Could not update project. Please try again." };
  }

  revalidatePath("/projects");
  revalidatePath("/analytics");

  return { success: true };
}