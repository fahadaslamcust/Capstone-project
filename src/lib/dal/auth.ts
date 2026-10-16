import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";

const SESSION_COOKIE = "session";

export async function createSession(userId: string) {
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE, userId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/"
	});
}

export async function verifySession() {
	const cookieStore = await cookies();
	const session = cookieStore.get(SESSION_COOKIE);
	if (!session?.value) {
		return null;
	}
	return { userId: session.value };
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async () => {
	const session = await verifySession();
	if (!session) return null;
	const [user] = await db
		.select({
			id: users.id,
			email: users.email,
			role: users.role,
			organization_id: users.organizationId
		})
		.from(users)
		.where(eq(users.id, session.userId))
		.limit(1);
	return user ?? null;
});
