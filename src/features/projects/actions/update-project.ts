'use server';

import { revalidateTag } from 'next/cache';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/dal/auth';
import { UpdateProjectSchema } from '../schemas/project';

export async function updateProjectAction(
  prevState: any,
  formData: FormData
) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

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

  await db
    .update(projects)
    .set({
      name: parsed.data.name,
      description: parsed.data.description,
    })
    .where(eq(projects.id, parsed.data.id));

  revalidateTag('projects','max');

  return { success: true };
}