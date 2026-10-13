"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {error: null});
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <form action={formAction} className="flex w-80 flex-col gap-4 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input name="username" required className="rounded border p-2" placeholder="Enter your username"/>
        <input name="password" type="password" required  className="rounded border p-2" placeholder="Enter your password"/>
        <button disabled={pending} className="self-center rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50 ">
            {pending ? "Signing in..." : "Sign In"}
        </button>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </form>
    </main>
  );
}