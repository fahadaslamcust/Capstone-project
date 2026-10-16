"use client";

import { useActionState, useOptimistic } from "react";
import { createProjectAction } from "../actions/create-project";
import { ProjectCard } from "./project-card";

type Project = {
	id: string;
	name: string;
	description: string | null
	status: string;
};

export function ProjectList({initialProjects}: {
	initialProjects: Project[];
}){
	const [optimisticProjects, addOptimisticProject] = useOptimistic(
		initialProjects,
		(state, newProject: Project) => [...state, newProject]
	);
	const [state, formAction, isPending] = useActionState(
		async (prevState: unknown, formData: FormData) => {
			addOptimisticProject({
				id: Math.random().toString(), 
				name: formData.get("name") as string,
				description: formData.get("description") as string,
				status: "saving..."
			});
			return await createProjectAction(prevState, formData);
		},
		null
	);
	return (
		<div className="space-y-6">
			<form action={formAction} className="flex gap-4 items-start bg-white p-4 rounded shadow">
				<div className="flex flex-col gap-1">
					<input
						name="name"
						required
						placeholder="Project Name"
						className="border p-2 rounded"
					/>
					{state?.fieldErrors?.name && (<span className="text-red-500 text-sm">{state.fieldErrors.name}</span>)}
				</div>
				<input
					name="description"
					placeholder="Description"
					className="border p-2 rounded"
				/>
				<button disabled={isPending} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
					{isPending ? "Saving..." : "Add Project"}
				</button>
			</form>
			<div className="grid grid-cols-3 gap-4">
				{optimisticProjects.map((p) => (<ProjectCard key={p.id} project={p} />))}
			</div>
		</div>
	);
}
