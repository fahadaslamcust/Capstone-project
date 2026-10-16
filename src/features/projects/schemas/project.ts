import { z } from "zod";

export const CreateProjectSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters").max(50),
	description: z.string().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.extend({
	id: z.string().uuid(),
});
