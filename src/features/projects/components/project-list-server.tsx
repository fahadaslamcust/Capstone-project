import { and, asc, eq, like } from 'drizzle-orm';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { getCurrentUser } from '@/lib/dal/auth';
import { ProjectList } from './project-list';

type Props = {
  query: string;
  status: string;
};

export async function ProjectListServer({ query, status }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    return <p className="text-sm text-gray-500">Sign in to view projects.</p>;
  }

  const conditions = [eq(projects.organizationId, user.organization_id)];
  if (query) conditions.push(like(projects.name, `%${query}%`));
  if (status) conditions.push(eq(projects.status, status));

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
    })
    .from(projects)
    .where(and(...conditions))
    .orderBy(asc(projects.createdAt));

  return <ProjectList initialProjects={rows} />;
}