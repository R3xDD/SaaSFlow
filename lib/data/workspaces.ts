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
  return createWorkspaceForUser(user.id, name, description);
}

export async function createWorkspaceForUser(
  userId: string,
  name: string,
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
          userId,
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

export async function listWorkspacesForUser(userId: string) {
  const memberships = await withDatabaseError(
    () => Array.fromAsync(db.orm.public.Membership.where({ userId }).all()),
    `list workspaces for user ${userId}`,
  );

  return withDatabaseError(
    () => Promise.all(memberships.map(({ workspaceId }) => getWorkspaceRecord(workspaceId))),
    `load workspaces for user ${userId}`,
  );
}

export async function updateWorkspaceForUser(
  userId: string,
  workspaceId: string,
  data: { name?: string; description?: string },
) {
  await requireWorkspacePermission(userId, workspaceId, "workspace:update");

  return withDatabaseError(
    () => db.orm.public.Workspace.where({ id: workspaceId }).update(data),
    `update workspace ${workspaceId}`,
  );
}

export async function deleteWorkspaceForUser(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "workspace:delete");

  return withDatabaseError(
    () => db.orm.public.Workspace.where({ id: workspaceId }).delete(),
    `delete workspace ${workspaceId}`,
  );
}