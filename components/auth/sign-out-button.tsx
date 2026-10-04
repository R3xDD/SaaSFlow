"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/src/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <button className="rounded-md border px-3 py-2 text-sm" disabled={isPending} onClick={signOut} type="button">
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
