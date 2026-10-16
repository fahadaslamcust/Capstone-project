import { ArchiveButton } from "./archive-button";
import { EditProjectForm } from "./edit-project-form";

type Project = {
	id: string;
	name: string;
	description: string | null;
	status?: string;
};
export function ProjectCard({ project }: { project: Project }) {
	return (
		<div className="border rounded p-4 shadow-sm bg-white">
			<h3 className="font-semibold">{project.name}</h3>
			{project.description && (<p className="text-sm text-gray-600 mt-1">{project.description}</p>)}
			{project.status && (<p className="text-xs text-blue-500 mt-2">({project.status})</p>)}
			{project.status !== "archived" && (
				<div className="mt-3 flex flex-wrap items-start gap-4">
					<EditProjectForm id={project.id} name={project.name} description={project.description}/>
					<ArchiveButton projectId={project.id} />
				</div>
			)}
		</div>
	);
}
