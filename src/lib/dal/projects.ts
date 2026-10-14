import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function getFilteredProjects(orgId: string, query: string, status: string) {
  'use cache';
  // cacheLife and cacheTag can be applied at the function level
  // next: { tags: ['projects'] } is the old way, use specific directives in 16.3+
  
  const filters = [eq(projects.organizationId, orgId)];
  
  if (query) {
    filters.push(like(projects.name, `%${query}%`));
  }
  
  if (status) {
    filters.push(eq(projects.status, status));
  }

  return await db.select().from(projects).where(and(...filters));
}