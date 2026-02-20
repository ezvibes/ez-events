export default function EventsLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-zinc-50 p-4 sm:p-6">
      <div className="mb-6 h-10 w-56 animate-pulse rounded bg-zinc-200" />
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_auto]">
          <div className="h-10 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>

      <section className="space-y-3">
        {[1, 2, 3].map((item) => (
          <article
            key={item}
            className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5"
          >
            <div className="mb-3 h-6 w-3/5 animate-pulse rounded bg-zinc-200" />
            <div className="mb-2 h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-100" />
          </article>
        ))}
      </section>
    </main>
  );
}
