"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { queueToastForNextRoute, useToast } from "@/app/_components/ToastProvider";
import {
  parseVenuesFromInput,
  toIsoFromLocalDateTime,
  toLocalDateTimeInputValue,
} from "@/app/events/_components/form-utils";
import { formatSportTypeLabel, SPORT_TYPES } from "@/lib/events/types";

type EditEventFormProps = {
  eventId: string;
  initialValues: {
    name: string;
    sportType: string;
    startsAtIso: string;
    venues: string[];
    description: string | null;
  };
};

type UpdateEventResponse = {
  error?: string;
};

export default function EditEventForm({ eventId, initialValues }: EditEventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const venues = parseVenuesFromInput(String(formData.get("venues") ?? ""));

    const payload = {
      update: {
        name: String(formData.get("name") ?? "").trim(),
        sportType: String(formData.get("sportType") ?? "").trim(),
        startsAtIso: toIsoFromLocalDateTime(String(formData.get("startsAt") ?? "")),
        venues,
        description: String(formData.get("description") ?? "").trim() || null,
      },
    };

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | UpdateEventResponse
        | null;

      if (!response.ok) {
        const message = data?.error ?? "Failed to update event.";
        setError(message);
        showToast(message, "error");
        return;
      }

      queueToastForNextRoute("Event updated successfully.", "success");
      router.push("/events");
      router.refresh();
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as
        | UpdateEventResponse
        | null;

      if (!response.ok) {
        const message = data?.error ?? "Failed to delete event.";
        setError(message);
        showToast(message, "error");
        return;
      }

      queueToastForNextRoute("Event deleted.", "success");
      router.push("/events");
      router.refresh();
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-800">
          Event name
        </label>
        <input
          id="name"
          name="name"
          required
          disabled={isSubmitting}
          defaultValue={initialValues.name}
          className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="sportType" className="text-sm font-medium text-zinc-800">
            Sport type
          </label>
          <select
            id="sportType"
            name="sportType"
            required
            disabled={isSubmitting}
            defaultValue={initialValues.sportType}
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {SPORT_TYPES.map((sportType) => (
              <option key={sportType} value={sportType}>
                {formatSportTypeLabel(sportType)}
              </option>
            ))}
            {!SPORT_TYPES.includes(initialValues.sportType as (typeof SPORT_TYPES)[number]) ? (
              <option value={initialValues.sportType}>
                {formatSportTypeLabel(initialValues.sportType)}
              </option>
            ) : null}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="venues" className="text-sm font-medium text-zinc-800">
            Venues (comma separated)
          </label>
          <input
            id="venues"
            name="venues"
            required
            disabled={isSubmitting}
            defaultValue={initialValues.venues.join(", ")}
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="startsAt" className="text-sm font-medium text-zinc-800">
          Date and time
        </label>
        <input
          id="startsAt"
          name="startsAt"
          type="datetime-local"
          required
          disabled={isSubmitting}
          defaultValue={toLocalDateTimeInputValue(initialValues.startsAtIso)}
          className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-zinc-800">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          disabled={isSubmitting}
          defaultValue={initialValues.description ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/events"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting || isDeleting}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isSubmitting || isDeleting}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-red-300 px-4 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting ? "Deleting..." : "Delete Event"}
        </button>
      </div>
    </form>
  );
}
