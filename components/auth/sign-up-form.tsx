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
    <form action={onSubmit} className="mt-6 space-y-4">
      <label className="grid gap-1 text-sm font-medium">
        Name
        <input className="rounded-md border px-3 py-2" name="name" required />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Email
        <input className="rounded-md border px-3 py-2" name="email" type="email" required />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Password
        <input className="rounded-md border px-3 py-2" minLength={8} name="password" type="password" required />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50" disabled={isPending} type="submit">
        {isPending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-sm">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </form>
  );
}
