import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-[var(--saas-canvas)] lg:grid-cols-[minmax(340px,0.9fr)_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[var(--saas-sidebar)] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
        <Link className="flex items-center gap-2 text-sm font-bold tracking-tight" href="/">
          <span className="grid size-7 place-items-center rounded-lg bg-[var(--saas-blue)] text-xs">S</span>
          SaaSFlow
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--saas-blue)]">Build in focus</p>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.05em] xl:text-5xl">Manage your development team without the chaos.</h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">Projects, tasks, and teammates in one calm workspace built for teams that ship.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-xs text-white/45"><span className="h-px w-8 bg-white/25" />SaaSFlow workspace platform</div>
        <div className="absolute -bottom-28 -right-24 size-72 rounded-full border-[36px] border-[var(--saas-blue)]/10" />
        <div className="absolute -right-16 top-1/3 size-40 rounded-full border border-white/10" />
      </section>
      <section className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-12 lg:px-20 xl:px-28">
        <Link className="mb-10 flex items-center gap-2 text-sm font-bold tracking-tight text-[var(--saas-navy)] lg:hidden" href="/">
          <span className="grid size-7 place-items-center rounded-lg bg-[var(--saas-blue)] text-xs text-white">S</span>SaaSFlow
        </Link>
        <div className="w-full max-w-md"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--saas-blue)]">SaaSFlow account</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-[var(--saas-navy)]">{title}</h1>{children}</div>
      </section>
    </main>
  );
}
