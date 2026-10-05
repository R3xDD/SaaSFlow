import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--saas-sidebar)] text-white">
      <nav className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight"><span className="grid size-7 place-items-center rounded-lg bg-[var(--saas-blue)] text-xs">S</span>SaaSFlow</h1>

          <div className="flex gap-3">
            <Link className="rounded-xl px-4 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/8 hover:text-white" href="/sign-in">
              Sign in
            </Link>

            <Link className="rounded-xl bg-[var(--saas-blue)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--saas-blue-dark)]" href="/sign-up">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div className="relative z-10 max-w-2xl">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-indigo-300">Project management for teams who ship</p>
        <h2 className="text-5xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
          Manage your development team without the chaos.
        </h2>

        <p className="mt-7 max-w-lg text-lg leading-8 text-white/55">
          A simple workspace for managing projects, tasks, teammates,
          and development workflows.
        </p>

        <Link className="mt-9 inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--saas-navy)] shadow-xl shadow-black/20 transition hover:-translate-y-0.5" href="/sign-up">
          Get started
        </Link>
        </div>
        <div className="relative mt-16 lg:mt-0">
          <div className="absolute -inset-8 rounded-[2.5rem] bg-indigo-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-md rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div className="rounded-2xl bg-[var(--saas-canvas)] p-4 text-[var(--saas-navy)] sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--saas-blue)]">Workspace overview</p><p className="mt-1 text-lg font-bold">Good morning, team.</p></div><span className="grid size-8 place-items-center rounded-full bg-[var(--saas-lilac)] text-xs font-bold">YS</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white p-4"><p className="text-2xl font-bold">8</p><p className="mt-1 text-[10px] font-semibold text-slate-400">Projects</p></div><div className="rounded-xl bg-white p-4"><p className="text-2xl font-bold">124</p><p className="mt-1 text-[10px] font-semibold text-slate-400">Tasks</p></div></div><div className="mt-3 rounded-xl bg-white p-4"><div className="flex justify-between text-xs font-bold"><span>Tasks by status</span><span className="text-slate-400">This week</span></div><div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100"><span className="w-[42%] bg-[var(--saas-blue)]" /><span className="w-[28%] bg-orange-400" /><span className="w-[30%] bg-emerald-400" /></div><div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-semibold text-slate-400"><span>To do 32</span><span>Active 30</span><span>Done 46</span></div></div></div>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full border border-indigo-300/10" />
      </section>
    </main>
  );
}
