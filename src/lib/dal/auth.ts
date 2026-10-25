import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";

const SESSION_COOKIE = "session";

type CurrentUser = {
    id: string;
    email: string;
    role: string;
    organization_id: string;
};

export async function createSession(userId: string) {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
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

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    const session = await verifySession();

    if (!session) return null;

    const url = process.env.D1_WORKER_URL;
    const secret = process.env.D1_WORKER_SECRET;

    if (!url || !secret) {
        throw new Error("D1 Worker environment variables are missing.");
    }

    const response = await fetch(
        `${url.replace(/\/+$/, "")}/users/by-id?id=${encodeURIComponent(session.userId)}`,
        {
            headers: {
                "X-API-Secret": secret,
            },
            cache: "no-store",
        },
    );

    if (!response.ok) {
        throw new Error(`Could not retrieve current user (${response.status}).`);
    }

    const data: { user: CurrentUser | null } = await response.json();

    return data.user;
});