"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // Next.js throws NEXT_REDIRECT on successful redirect — must re-throw it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw error;
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
