"use client";

import { useState } from "react";

type AuthMode = "login";

type AuthFormProps = {
  mode?: AuthMode;
};

export default function AuthForm({ mode = "login" }: AuthFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const isLogin = mode === "login";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Form submitted. Auth wiring comes next.");
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
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
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
            autoComplete="current-password"
            required
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          {isLogin ? "Sign in" : "Create account"}
        </button>

        {status ? (
          <p className="text-sm text-zinc-600" role="status">
            {status}
          </p>
        ) : null}
      </form>
    </div>
  );
}
