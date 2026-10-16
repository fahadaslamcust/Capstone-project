import { getCurrentUser } from "@/lib/dal/auth";
import { getFilteredProjects } from "@/lib/dal/projects";
import { ProjectList } from "./project-list";

type Props = {
	query: string;
	status: string;
};

export async function ProjectListServer({ query, status }: Props) {
	const user = await getCurrentUser();
	if (!user) {
		return <p className="text-sm text-gray-500">Sign in to view projects.</p>;
	}
	const rows = await getFilteredProjects(user.organization_id, query, status);
	return <ProjectList initialProjects={rows} />;
}
