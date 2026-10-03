import { db } from "../../src/prisma/db";
import { NotFoundError } from "./errors";
import { withDatabaseError } from "./database";

export async function createProject(
  workspaceId: string,
  createdById: string,
  name: string,
  description?: string,
) {
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
        createdById,
        name,
        ...(description !== undefined ? { description } : {}),
      }),
    "create project",
  );
}


export async function getProjectsWithTasks(workspaceId: string) {
  return db.orm.public.Project
    .where({ workspaceId })
    .include("tasks")
    .all();
}
