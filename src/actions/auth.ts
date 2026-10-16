"use server";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/dal/auth";

type AuthState = {
	error: string | null;
};

const ROLES = ["admin", "member"] as const;
type Role = (typeof ROLES)[number];

function isRole(value: string): value is Role {
	return (ROLES as readonly string[]).includes(value);
}

export async function loginAction(_prevState: AuthState,formData: FormData): Promise<AuthState> {
	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();
	const password = String(formData.get("password") ?? "");

	if (!email || !password) {
		return { error: "Email and password are required." };
	}

	const user = db
		.select({
			id: users.id,
			passwordHash: users.passwordHash,
			role: users.role,
		})
		.from(users)
		.where(eq(users.email, email))
		.get();

	const valid = user
		? await bcrypt.compare(password, user.passwordHash)
		: false;
	if (!user || !valid) {
		return { error: "Invalid email or password." };
	}

	await createSession(user.id);
	redirect(user.role === "admin" ? "/projects" : "/analytics");
}

export async function signupAction(_prevState: AuthState,formData: FormData): Promise<AuthState> {
	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const password = String(formData.get("password") ?? "");
	const organizationName = String(
		formData.get("organizationName") ?? "",
	).trim();
	const role = String(formData.get("role") ?? "");
	if (!name || !email || !password || !organizationName || !role) {
		return { error: "All fields are required." };
	}
	if (!isRole(role)) {
		return { error: "Select a valid role." };
	}
	if (!email.includes("@")) {
		return { error: "Enter a valid email address." };
	}
	if (password.length < 5) {
		return { error: "Password must be at least 5 characters." };
	}
	const existing = db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
	if (existing) {
		return { error: "An account with this email already exists." };
	}
	const org = db.select({ id: organizations.id }).from(organizations).where(
			sql`lower(${organizations.name}) = ${organizationName.toLowerCase()}`,
		).get();
	if (org && role === "admin") {
		return {
			error: "That organization already exists. Select Member to join it.",
		};
	}
	if (!org && role === "member") {
		return {
			error:
				"Organization not found. Check the exact name with your admin, or sign up as Admin to create a new one.",
		};
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const organizationId = org?.id ?? crypto.randomUUID();
	const userId = crypto.randomUUID();
	const now = new Date();
	try {
		db.transaction((tx) => {
			if (!org) {
				tx.insert(organizations)
					.values({id: organizationId,name: organizationName,createdAt: now}).run();
			}
			tx.insert(users)
				.values({
					id: userId,
					email,
					name,
					role,
					organizationId,
					passwordHash,
					createdAt: now
				}).run();
		});
	} catch {
		return { error: "Could not create the account. Please try again." };
	}
	await createSession(userId);
	redirect("/login");
}
export async function logoutAction() {
	await deleteSession();
	redirect("/login");
}
