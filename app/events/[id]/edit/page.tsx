import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import EditEventForm from "@/app/events/[id]/edit/_components/EditEventForm";
import { getEventByIdForUser } from "@/lib/events/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EditEventPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await Promise.resolve(params);
  const eventId = id?.trim();
  if (!eventId) {
    notFound();
  }

  const event = await getEventByIdForUser(supabase, user.id, eventId);
  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl bg-zinc-50 p-4 sm:p-6">
      <header className="mb-4 flex flex-col gap-2 sm:mb-6">
        <Link
          href="/events"
          className="w-fit text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Back to events
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-900">Edit Event</h1>
        <p className="text-sm text-zinc-600">
          Update event details and save your changes.
        </p>
      </header>

      <EditEventForm
        eventId={event.id}
        initialValues={{
          name: event.name,
          sportType: event.sportType,
          startsAtIso: event.startsAt.toISOString(),
          venues: event.venues,
          description: event.description,
        }}
      />
    </main>
  );
}
