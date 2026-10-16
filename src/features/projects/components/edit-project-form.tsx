"use client";

import { useActionState, useState } from "react";
import { updateProjectAction } from "@/features/projects/actions/update-project";
import type { UpdateProjectState } from "../schemas/project";

type Props = { 
	id: string;
	name: string;
	description: string | null
};

export function EditProjectForm({ id, name, description }: Props) {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(
		async (prev: UpdateProjectState, formData: FormData) => {
			const result = await updateProjectAction(prev, formData);
			if (result?.success) setOpen(false);
			return result;
		},
		null
	);
	if (!open) {
		return (
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-sm text-blue-600 hover:underline"
			>
				Edit
			</button>
		);
	}
	return (
		<form action={formAction} className="w-full space-y-2">
			<input type="hidden" name="id" value={id} />
			<input
				name="name"
				defaultValue={name}
				required
				className="w-full border rounded px-2 py-1 text-sm"
			/>
			<textarea
				name="description"
				defaultValue={description ?? ""}
				className="w-full border rounded px-2 py-1 text-sm"
			/>
			{state?.error && <p className="text-xs text-red-500">{state.error}</p>}
			<div className="flex gap-3 text-sm">
				<button type="submit" disabled={isPending} className="text-blue-600 disabled:opacity-50">
					{isPending ? "Saving..." : "Save"}
				</button>
				<button type="button" onClick={() => setOpen(false)}className="text-gray-500">
					Cancel
				</button>
			</div>
		</form>
	);
}