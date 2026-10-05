"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/src/auth/client";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);

    const { error } = await authClient.signUp.email({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      callbackURL: "/dashboard",
    });

    setIsPending(false);

    if (error) {
      setError(error.message ?? "Unable to create your account.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="mt-8 space-y-5">
      <label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">
        Name
        <input className="h-11 rounded-xl border border-[var(--saas-line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--saas-blue)] focus:ring-4 focus:ring-emerald-100" name="name" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">
        Email
        <input className="h-11 rounded-xl border border-[var(--saas-line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--saas-blue)] focus:ring-4 focus:ring-emerald-100" name="email" type="email" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">
        Password
        <input className="h-11 rounded-xl border border-[var(--saas-line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--saas-blue)] focus:ring-4 focus:ring-emerald-100" minLength={8} name="password" type="password" required />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="h-11 w-full rounded-xl bg-[var(--saas-blue)] px-4 text-sm font-bold text-white shadow-[0_10px_22px_-8px_rgba(29,138,90,0.7)] transition hover:bg-[var(--saas-blue-dark)] hover:shadow-[0_12px_26px_-8px_rgba(29,138,90,0.85)] disabled:opacity-50" disabled={isPending} type="submit">
        {isPending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-sm font-semibold text-slate-500">
        Already have an account? <Link className="text-[var(--saas-blue)]" href="/sign-in">Sign in</Link>
      </p>
    </form>
  );
}
