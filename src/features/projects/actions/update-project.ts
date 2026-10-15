'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { getCurrentUser } from '@/lib/dal/auth';
import { logActivity } from '@/lib/log-activity';
import { UpdateProjectSchema } from '../schemas/project';

export async function updateProjectAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = UpdateProjectSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return {
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const updated = await db
    .update(projects)
    .set({
      name: parsed.data.name,
      description: parsed.data.description,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(projects.id, parsed.data.id),
        eq(projects.organizationId, user.organization_id)
      )
    )
    .returning({ id: projects.id });

  if (updated.length === 0) return { error: 'Project not found' };

  await logActivity(user.id, 'PROJECT_UPDATED', parsed.data.id);

  revalidatePath('/projects');
  revalidatePath('/analytics');

  return { success: true };
}