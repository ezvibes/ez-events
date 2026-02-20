import Link from "next/link";
import { redirect } from "next/navigation";
import EventsListWithLoadMore from "@/app/events/_components/EventsListWithLoadMore";
import LogoutButton from "@/app/events/_components/LogoutButton";
import { listEventsForUser } from "@/lib/events/repository";
import {
  formatSportTypeLabel,
  parseEventListQuery,
  SPORT_TYPES,
} from "@/lib/events/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EventsPageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await Promise.resolve(searchParams ?? {});
  const urlSearchParams = toURLSearchParams(params);
  const queryResult = parseEventListQuery(urlSearchParams);

  if (!queryResult.ok) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl bg-zinc-50 p-4 sm:p-6">
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Invalid query: {queryResult.error}
        </section>
      </main>
    );
  }

  const result = await listEventsForUser(supabase, user.id, queryResult.data);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-zinc-50 p-4 sm:p-6">
      <header className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Events Overview</h1>
          <p className="text-sm text-zinc-600">{result.total} total events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/events/new"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create Event
          </Link>
          <LogoutButton />
        </div>
      </header>

      <form className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-[1fr_220px_auto] sm:items-end sm:gap-4 sm:mb-6">
        <div className="space-y-1">
          <label htmlFor="q" className="text-sm font-medium text-zinc-700">
            Search by name
          </label>
          <input
            id="q"
            name="q"
            defaultValue={queryResult.data.q ?? ""}
            placeholder="Search events..."
            className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-zinc-900"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="sportType" className="text-sm font-medium text-zinc-700">
            Sport type
          </label>
          <select
            id="sportType"
            name="sportType"
            defaultValue={queryResult.data.sportType ?? ""}
            className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 outline-none focus:border-zinc-900"
          >
            <option value="">All sports</option>
            {SPORT_TYPES.map((sport) => (
              <option key={sport} value={sport}>
                {formatSportTypeLabel(sport)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Apply
        </button>
      </form>

      <EventsListWithLoadMore
        initialEvents={result.events.map((event) => ({
          id: event.id,
          name: event.name,
          sportType: event.sportType,
          startsAt: event.startsAt.toISOString(),
          venues: event.venues,
          description: event.description,
        }))}
        total={result.total}
        initialPage={result.page}
        pageSize={result.pageSize}
        q={queryResult.data.q}
        sportType={queryResult.data.sportType}
      />
    </main>
  );
}

function toURLSearchParams(params: Record<string, string | string[] | undefined>) {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        urlSearchParams.append(key, item);
      }
    } else if (value) {
      urlSearchParams.set(key, value);
    }
  }
  return urlSearchParams;
}
