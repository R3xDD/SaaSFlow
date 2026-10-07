"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 text-center">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-slate-700">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">Workspace error</p>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Something went wrong.</h2>
        <p className="mt-2 text-sm text-slate-600">
          We could not load this dashboard view. Try again to refresh the workspace data.
        </p>
        <button
          className="mt-6 rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
