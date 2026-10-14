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

      {project.description && (
        <p className="text-sm text-gray-600 mt-1">
          {project.description}
        </p>
      )}

      {project.status && (
        <p className="text-xs text-blue-500 mt-2">
          ({project.status})
        </p>
      )}
    </div>
  );
}