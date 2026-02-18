"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EventListItem = {
  id: string;
  name: string;
  sportType: string;
  startsAt: string;
  venues: string[];
  description: string | null;
};

type EventsListWithLoadMoreProps = {
  initialEvents: EventListItem[];
  total: number;
  initialPage: number;
  pageSize: number;
  q?: string;
  sportType?: string;
};

export default function EventsListWithLoadMore({
  initialEvents,
  total,
  initialPage,
  pageSize,
  q,
  sportType,
}: EventsListWithLoadMoreProps) {
  const [events, setEvents] = useState<EventListItem[]>(initialEvents);
  const [totalCount, setTotalCount] = useState(total);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = useMemo(
    () => events.length < totalCount && !isLoading,
    [events.length, totalCount, isLoading]
  );

  async function handleLoadMore() {
    if (!canLoadMore) return;

    setError(null);
    setIsLoading(true);

    const nextPage = page + 1;
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    params.set("pageSize", String(pageSize));
    if (q) params.set("q", q);
    if (sportType) params.set("sportType", sportType);

    try {
      const response = await fetch(`/api/events?${params.toString()}`, {
        method: "GET",
      });
      const data = (await response.json().catch(() => null)) as
        | { events?: EventListItem[]; total?: number; error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error || "Failed to load more events.");
        return;
      }

      const incoming = Array.isArray(data?.events) ? data.events : [];
      setEvents((current) => [...current, ...incoming]);
      if (typeof data?.total === "number") {
        setTotalCount(data.total);
      }
      setPage(nextPage);
    } catch {
      setError("Network error while loading more.");
    } finally {
      setIsLoading(false);
    }
  }

  if (events.length === 0) {
    return (
      <section className="space-y-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
          No events found for this query.
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {events.map((event) => (
        <article
          key={event.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">{event.name}</h2>
              <Link
                href={`/events/${event.id}/edit`}
                className="mt-1 inline-flex text-xs font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900"
              >
                Edit event
              </Link>
            </div>
            <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-700">
              {event.sportType.replaceAll("_", " ")}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-3">
            <p>
              <span className="font-medium text-zinc-900">Date & time:</span>{" "}
              {formatDate(event.startsAt)}
            </p>
            <p>
              <span className="font-medium text-zinc-900">Venue:</span>{" "}
              {event.venues.join(", ")}
            </p>
          </div>
          {event.description ? (
            <p className="mt-3 text-sm text-zinc-600">{event.description}</p>
          ) : null}
        </article>
      ))}

      <div className="pt-2">
        {canLoadMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more"}
          </button>
        ) : (
          <p className="text-sm text-zinc-500">You have reached the end of the list.</p>
        )}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}
