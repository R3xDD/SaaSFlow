import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../prisma/db";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireApplicationUser() {
  const session = await requireSession();
  const user = await db.orm.public.User.first({
    authUserId: session.user.id,
  });

  if (!user) {
    throw new Error("Authenticated user is missing its SaaSFlow user record.");
  }

  return { session, user };
}
