import "server-only";

import { requireApplicationUser } from "../../src/auth/session";
import { db } from "../../src/prisma/db";
import { requireWorkspacePermission } from "./authorization";
import { NotFoundError } from "./errors";
import { withDatabaseError } from "./database";

export async function createWorkspace(
  name: string,
  description?: string,
) {
  const { user } = await requireApplicationUser();

  return withDatabaseError(
    () =>
      db.transaction(async (tx) => {
        const workspace = await tx.orm.public.Workspace.create({
          name,
          ...(description !== undefined ? { description } : {}),
        });

        await tx.orm.public.Membership.create({
          userId: user.id,
          workspaceId: workspace.id,
          role: "OWNER",
        });

        return workspace;
      }),
    "create workspace",
  );
}

async function getWorkspaceRecord(id: string) {
  const workspace = await withDatabaseError(
    () => db.orm.public.Workspace.first({ id }),
    `get workspace ${id}`,
  );

  if (!workspace) {
    throw new NotFoundError("Workspace", id);
  }

  return workspace;
}

export async function getWorkspace(workspaceId: string) {
  const { user } = await requireApplicationUser();
  await requireWorkspacePermission(user.id, workspaceId, "workspace:view");

  return getWorkspaceRecord(workspaceId);
}