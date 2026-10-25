"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal/auth";
import { archiveProjectInD1 } from "@/lib/d1-worker";

export async function archiveProjectAction(projectId: string) {
  const user = await getCurrentUser();

  if (!user) return { error: "Unauthorized" };
  if (user.role !== "admin") return { error: "Forbidden" };

  try {
    await archiveProjectInD1({
      projectId,
      organizationId: user.organization_id,
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("(404)")) {
      return { error: "Project not found" };
    }

    return { error: "Could not archive project. Please try again." };
  }

  revalidatePath("/projects");
  revalidatePath("/analytics");

  return { success: true };
}