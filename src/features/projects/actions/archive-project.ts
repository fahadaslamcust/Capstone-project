'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { getCurrentUser } from '@/lib/dal/auth';
import { logActivity } from '@/lib/log-activity';

export async function archiveProjectAction(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (user.role !== 'admin') return { error: 'Forbidden' };

  const updated = await db
    .update(projects)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(
      and(eq(projects.id, projectId), eq(projects.organizationId, user.organization_id))
    )
    .returning({ id: projects.id });

  if (updated.length === 0) return { error: 'Project not found' };

  await logActivity(user.id, 'PROJECT_ARCHIVED', projectId);

  revalidatePath('/projects');
  revalidatePath('/analytics');

  return { success: true };
}