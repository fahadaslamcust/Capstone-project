"use client";
import { useActionState } from "react";
import { signupAction } from "@/actions/auth";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, { error: null });
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form action={formAction} className="flex w-80 flex-col gap-4 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <input name="name" required className="rounded border p-2" placeholder="Enter your full name" />
        <input name="email" type="email" required className="rounded border p-2" placeholder="Enter your email" />
        <input name="password" type="password" required minLength={5} className="rounded border p-2" placeholder="Enter your password" />
        <input name="organizationName" required className="rounded border p-2" placeholder="Enter organization name" />
        <select name="role" required defaultValue="" className="rounded border p-2">
          <option value="" disabled>Select role</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
        <button disabled={pending} className="self-center rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50">
          {pending ? "Creating account..." : "Sign Up"}
        </button>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      </form>
    </main>
  );
}