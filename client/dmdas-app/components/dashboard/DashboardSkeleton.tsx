export default function DashboardSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl animate-pulse" aria-busy="true" aria-live="polite">
      <div className="block items-start justify-between gap-4 py-3 md:flex lg:flex">
        <div className="space-y-3">
          <div className="h-9 w-56 rounded-xl bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-200" />
        </div>
        <div className="mt-4 h-11 w-32 rounded-xl bg-slate-200 md:mt-0" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="mt-4 h-8 w-24 rounded bg-slate-200" />
            <div className="mt-4 h-3 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mt-6 h-24 rounded-2xl border border-slate-200 bg-slate-100" />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-200" />
          </div>

          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <div className="h-10 w-10 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-40 rounded bg-slate-200" />
                </div>
                <div className="h-6 w-16 rounded bg-slate-200" />
                <div className="h-6 w-14 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>

            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-16 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="h-5 w-20 rounded bg-slate-200" />
            <div className="mt-4 h-8 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-28 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
