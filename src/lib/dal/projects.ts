
import { getFilteredProjectsFromD1 } from "@/lib/d1-worker";

export async function getFilteredProjects(
  orgId: string,
  query: string,
  status: string,
) {
  "use cache";

  const { projects } = await getFilteredProjectsFromD1(
    orgId,
    query,
    status,
  );

  return projects.map((project) => ({
    ...project,
    createdAt: new Date(project.createdAt * 1000),
    updatedAt: new Date(project.updatedAt * 1000),
  }));
}
