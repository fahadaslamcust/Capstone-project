"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/dal/auth";

type AuthState = {
    error: string | null;
};

const ROLES = ["admin", "member"] as const;
type Role = (typeof ROLES)[number];

function isRole(value: string): value is Role {
    return (ROLES as readonly string[]).includes(value);
}

function getWorkerConfig() {
    const url = process.env.D1_WORKER_URL;
    const secret = process.env.D1_WORKER_SECRET;

    if (!url || !secret) {
        throw new Error("D1 Worker environment variables are missing.");
    }

    return {
        url: url.replace(/\/+$/, ""),
        secret,
    };
}

async function workerRequest<T>(
    path: string,
    body: unknown,
): Promise<{ response: Response; data: T | null }> {
    const { url, secret } = getWorkerConfig();

    const response = await fetch(`${url}${path}`, {
        method: "POST",
        headers: {
            "X-API-Secret": secret,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json().catch(() => null) as T | null;

    return { response, data };
}

export async function loginAction(
    _prevState: AuthState,
    formData: FormData,
): Promise<AuthState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const { response, data } = await workerRequest<{
        user: { id: string; passwordHash: string; role: string } | null;
    }>("/auth/login", { email });

    if (!response.ok || !data) {
        return { error: "Could not log in. Please try again." };
    }

    const user = data.user;
    const valid = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

    if (!user || !valid) {
        return { error: "Invalid email or password." };
    }

    await createSession(user.id);
    redirect(user.role === "admin" ? "/projects" : "/analytics");
}

export async function signupAction(
    _prevState: AuthState,
    formData: FormData,
): Promise<AuthState> {
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

    const passwordHash = await bcrypt.hash(password, 10);

    const { response, data } = await workerRequest<{
        success?: boolean;
        error?: string;
        userId?: string;
    }>("/auth/signup", {
        name,
        email,
        passwordHash,
        organizationName,
        role,
    });

    if (response.status === 409 && data?.error === "EMAIL_EXISTS") {
        return { error: "An account with this email already exists." };
    }

    if (response.status === 409 && data?.error === "ORG_EXISTS") {
        return {
            error: "That organization already exists. Select Member to join it.",
        };
    }

    if (response.status === 404 && data?.error === "ORG_NOT_FOUND") {
        return {
            error:
                "Organization not found. Check the exact name with your admin, or sign up as Admin to create a new one.",
        };
    }

    if (!response.ok || !data?.success || !data.userId) {
        return { error: "Could not create the account. Please try again." };
    }

    await createSession(data.userId);
    redirect("/login");
}

export async function logoutAction() {
    await deleteSession();
    redirect("/login");
}