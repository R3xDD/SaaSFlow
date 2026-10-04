import "server-only";

import { requireApplicationUser } from "../../src/auth/session";
import { db } from "../../src/prisma/db";
import { requireWorkspacePermission } from "./authorization";
import { NotFoundError } from "./errors";
import { withDatabaseError } from "./database";

export async function createProject(
  workspaceId: string,
  name: string,
  description?: string,
) {
  const { user } = await requireApplicationUser();
  await requireWorkspacePermission(user.id, workspaceId, "project:create");

  const workspace = await withDatabaseError(
    () => db.orm.public.Workspace.first({ id: workspaceId }),
    `get workspace ${workspaceId}`,
  );

  if (!workspace) {
    throw new NotFoundError("Workspace", workspaceId);
  }

  return withDatabaseError(
    () =>
      db.orm.public.Project.create({
        workspaceId,
        createdById: user.id,
        name,
        ...(description !== undefined ? { description } : {}),
      }),
    "create project",
  );
}


export async function getProjectsWithTasks(workspaceId: string) {
  const { user } = await requireApplicationUser();
  await requireWorkspacePermission(user.id, workspaceId, "workspace:view");

  return db.orm.public.Project
    .where({ workspaceId })
    .include("tasks")
    .all();
}
