import Link from "next/link";
import { redirect } from "next/navigation";
import NewEventForm from "@/app/events/new/_components/NewEventForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewEventPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
        <h1 className="text-2xl font-semibold text-zinc-900">Create New Event</h1>
        <p className="text-sm text-zinc-600">
          Add basic details to publish an event to your dashboard.
        </p>
      </header>

      <NewEventForm />
    </main>
  );
}
