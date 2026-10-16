'use server';

import { revalidateTag } from 'next/cache';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/dal/auth';

export async function archiveProjectAction(projectId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (user.role !== 'admin') {
    return { error: 'Forbidden' };
  }

  await db
    .update(projects)
    .set({
      status: 'archived',
    })
    .where(eq(projects.id, projectId));

  revalidateTag('projects','max');

  return { success: true };
}