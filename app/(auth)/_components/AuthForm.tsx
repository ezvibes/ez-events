"use client";

import { useState } from "react";
import { queueToastForNextRoute, useToast } from "@/app/_components/ToastProvider";
import { loginAction, signupAction } from "@/app/(auth)/_actions/auth";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode?: AuthMode;
};

export default function AuthForm({ mode = "login" }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = mode === "login";
  const { showToast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    try {
      const result = isLogin
        ? await loginAction(payload)
        : await signupAction(payload);

      if (!result.ok) {
        const message = result.error || (isLogin ? "Login failed." : "Signup failed.");
        setError(message);
        showToast(message, "error");
        return;
      }

      const successMessage = isLogin ? "Login successful." : "Signup successful.";
      queueToastForNextRoute(successMessage, "success");
      form.reset();
      window.location.href = "/events";
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {isLogin ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Use your email and password to continue.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-800"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? isLogin
              ? "Signing in..."
              : "Creating account..."
            : isLogin
              ? "Sign in"
              : "Create account"}
        </button>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
