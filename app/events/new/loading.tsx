export default function NewEventLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl bg-zinc-50 p-4 sm:p-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-zinc-200" />
      <section className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="space-y-4">
          <div className="h-11 animate-pulse rounded bg-zinc-100" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-11 animate-pulse rounded bg-zinc-100" />
            <div className="h-11 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="h-11 animate-pulse rounded bg-zinc-100" />
          <div className="h-28 animate-pulse rounded bg-zinc-100" />
          <div className="flex justify-end gap-3">
            <div className="h-11 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="h-11 w-32 animate-pulse rounded bg-zinc-300" />
          </div>
        </div>
      </section>
    </main>
  );
}
