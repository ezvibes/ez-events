"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { queueToastForNextRoute, useToast } from "@/app/_components/ToastProvider";
import { logoutAction } from "@/app/(auth)/_actions/auth";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleLogout() {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await logoutAction();
      if (!result.ok) {
        const message = result.error ?? "Failed to logout.";
        setError(message);
        showToast(message, "error");
        return;
      }

      queueToastForNextRoute("Logged out successfully.", "success");
      router.push("/login");
      router.refresh();
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      showToast(message, "error");
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
