import { db } from "../../src/prisma/db";
import { NotFoundError } from "./errors";
import { withDatabaseError } from "./database";

export async function createWorkspace(
  name: string,
  ownerId: string,
  description?: string,
) {
  return withDatabaseError(
    () =>
      db.transaction(async (tx) => {
        const workspace = await tx.orm.public.Workspace.create({
          name,
          ...(description !== undefined ? { description } : {}),
        });

        await tx.orm.public.Membership.create({
          userId: ownerId,
          workspaceId: workspace.id,
          role: "OWNER",
        });

        return workspace;
      }),
    "create workspace",
  );
}

export async function getWorkspace(id: string) {
  const workspace = await withDatabaseError(
    () => db.orm.public.Workspace.first({ id }),
    `get workspace ${id}`,
  );

  if (!workspace) {
    throw new NotFoundError("Workspace", id);
  }

  return workspace;
}