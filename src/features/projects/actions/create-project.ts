'use server';

import { revalidateTag } from 'next/cache';
import { db } from '@/db';
import { projects, activityLogs } from '@/db/schema';
import { getCurrentUser } from '@/lib/dal/auth';
import { CreateProjectSchema } from '../schemas/project';

export async function createProjectAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = CreateProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const projectId = crypto.randomUUID();

  // Run as a transaction so both project creation and log creation succeed or fail together
  await db.transaction(async (tx) => {
    await tx.insert(projects).values({
      id: projectId,
      name: parsed.data.name,
      description: parsed.data.description,
      organizationId: user.organization_id,
      createdById: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active"
    });

    await tx.insert(activityLogs).values({
      id: crypto.randomUUID(),
      action: 'PROJECT_CREATED',
      entityType: 'project',
      entityId: projectId,
      userId: user.id,
      createdAt: new Date()
    });
  });

  revalidateTag('projects','max');
  
  return { success: true };
}