"use client";

import { useState } from "react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode?: AuthMode;
};

type AuthResponse = {
  message?: string;
  error?: string;
};

export default function AuthForm({ mode = "login" }: AuthFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = mode === "login";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    try {
      const response = await fetch(
        isLogin ? "/api/auth/login" : "/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await response.json().catch(() => null)) as
        | AuthResponse
        | null;

      if (!response.ok) {
        setError(data?.error || (isLogin ? "Login failed." : "Signup failed."));
        return;
      }

      setStatus(
        data?.message || (isLogin ? "Login successful." : "Signup successful.")
      );
      form.reset();
      window.location.href = "/";
    } catch {
      setError("Network error. Please try again.");
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
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
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
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
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

        {status ? (
          <p className="text-sm text-emerald-600" role="status">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
