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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <Link className="mb-8 text-sm font-medium" href="/">
        SaaSFlow
      </Link>
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{title}</h1>
        {children}
      </section>
    </main>
  );
}
