import { db } from "../src/prisma/db";

async function main() {
  const memberships = await Array.fromAsync(
    db.orm.public.Membership.all(),
  );

  if (memberships.length === 0) {
    throw new Error("Authorization check requires at least one membership.");
  }

  const membership = memberships[0];
  const allowedMembership = await db.orm.public.Membership.first({
    userId: membership.userId,
    workspaceId: membership.workspaceId,
  });

  if (!allowedMembership) {
    throw new Error("An existing workspace member was denied access.");
  }

  const deniedMembership = await db.orm.public.Membership.first({
    userId: "00000000-0000-0000-0000-000000000000",
    workspaceId: membership.workspaceId,
  });

  if (deniedMembership) {
    throw new Error("A non-member was not denied workspace access.");
  }

  console.log("Authorization membership checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });