"use server";

import { createSupabaseActionClient } from "@/lib/supabase/action";

type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

type AuthPayload = {
  email?: string;
  password?: string;
};

export async function loginAction(input: AuthPayload): Promise<ActionResult> {
  const email = input.email?.trim();
  const password = input.password ?? "";

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  try {
    const supabase = await createSupabaseActionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return { ok: false, error: message };
  }
}

export async function signupAction(input: AuthPayload): Promise<ActionResult> {
  const email = input.email?.trim();
  const password = input.password ?? "";

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  try {
    const supabase = await createSupabaseActionClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed.";
    return { ok: false, error: message };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const supabase = await createSupabaseActionClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed.";
    return { ok: false, error: message };
  }
}
