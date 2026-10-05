import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--saas-canvas)] text-[var(--saas-ink)]">
      <div className="grid min-h-screen lg:grid-cols-[0.78fr_1.22fr]">
        <section className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden bg-[var(--saas-sidebar)] px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12">
          <Link className="relative z-10 inline-flex w-fit items-center gap-2 text-sm font-bold tracking-tight" href="/">
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--saas-blue)] text-xs text-white shadow-[0_8px_18px_-10px_rgba(115,211,155,0.8)]">S</span>
            SaaSFlow
          </Link>

          <div className="relative z-10 mt-12 max-w-sm lg:mt-0">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--saas-blue)]">Route unavailable</p>
            <p className="text-[clamp(5rem,15vw,10rem)] font-bold leading-[0.78] tracking-[-0.09em] text-white/95">404</p>
            <p className="mt-8 max-w-xs text-sm leading-6 text-white/55">This page drifted outside the workspace. The rest of your work is still right where you left it.</p>
          </div>

          <p className="relative z-10 mt-12 text-xs font-medium text-white/35 lg:mt-0">SaaSFlow workspace platform</p>
          <div className="pointer-events-none absolute -bottom-24 -right-28 size-80 rounded-full border-[38px] border-[var(--saas-blue)]/10" />
          <div className="pointer-events-none absolute right-10 top-1/4 size-24 rounded-full border border-white/10" />
        </section>

        <section className="flex items-center px-6 py-14 sm:px-10 lg:px-20 xl:px-28">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex size-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-[var(--saas-red)] dark:border-red-300/20 dark:bg-red-950/30">
              <Search size={21} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--saas-blue)]">Nothing here</p>
            <h1 className="mt-3 max-w-lg text-4xl font-bold leading-tight tracking-[-0.05em] text-[var(--saas-navy)] sm:text-6xl">Let&apos;s get you back on track.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-500">The address you opened does not belong to this workspace. Try the dashboard or return to the SaaSFlow home page.</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-xl bg-[var(--saas-blue)] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_-10px_rgba(29,138,90,0.65)] transition hover:-translate-y-0.5 hover:bg-[var(--saas-blue-dark)] hover:shadow-[0_12px_24px_-10px_rgba(29,138,90,0.7)]" href="/">
                <Home size={16} />Go home
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-xl border border-[var(--saas-line)] bg-white px-5 py-3 text-sm font-bold text-[var(--saas-navy)] transition hover:-translate-y-0.5 hover:bg-[var(--saas-lilac)] dark:bg-white/5 dark:hover:bg-white/10" href="/sign-in">
                Open workspace<ArrowUpRight size={16} />
              </Link>
            </div>

            <Link className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-[var(--saas-blue)]" href="/">
              <ArrowLeft size={15} />Back to SaaSFlow
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
