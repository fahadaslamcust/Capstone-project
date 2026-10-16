import { describe, expect, it } from "vitest";
import { CreateProjectSchema } from "./project";

describe("CreateProjectSchema", () => {
	it("passes with valid inputs", () => {
		const result = CreateProjectSchema.safeParse({
			name: "Marketing Campaign",
			description: "Q4 deliverables",
		});
		expect(result.success).toBe(true);
	});

	it("fails if name is missing", () => {
		const result = CreateProjectSchema.safeParse({
			description: "Oops",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.name).toBeDefined();
		}
	});

	it("fails if name is too short", () => {
		const result = CreateProjectSchema.safeParse({
			name: "Ab",
		});
		expect(result.success).toBe(false);
	});
});
