"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutResponse = {
  error?: string;
};

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const data = (await response.json().catch(() => null)) as
        | LogoutResponse
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Failed to logout.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isSubmitting}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Logging out..." : "Logout"}
      </button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
