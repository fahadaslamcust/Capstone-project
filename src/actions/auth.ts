"use server";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/dal/auth";
type LoginState={
  error: string|null;
}
export async function loginAction( _prevState:LoginState, formData: FormData):Promise<LoginState> {
  const username = formData.get("username");
  const password = formData.get("password");

  // Temporary hardcoded validation
  if (username !== "admin" || password !== "password") {
    return { error: "Invalid credentials" };
  }

  await createSession("1");

  redirect("/dashboard");
}