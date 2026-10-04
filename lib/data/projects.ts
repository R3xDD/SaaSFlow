import "server-only";

import { requireApplicationUser } from "../../src/auth/session";
import { db } from "../../src/prisma/db";
import { requireProjectPermission, requireWorkspacePermission } from "./authorization";
import { NotFoundError } from "./errors";
import { withDatabaseError } from "./database";

export async function createProject(
  workspaceId: string,
  name: string,
  description?: string,
) {
  const { user } = await requireApplicationUser();
  return createProjectForUser(user.id, workspaceId, name, description);
}

export async function createProjectForUser(
  userId: string,
  workspaceId: string,
  name: string,
  description?: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "project:create");

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
        createdById: userId,
        name,
        ...(description !== undefined ? { description } : {}),
      }),
    "create project",
  );
}


export async function getProjectsWithTasks(workspaceId: string) {
  const { user } = await requireApplicationUser();
  return getProjectsWithTasksForUser(user.id, workspaceId);
}

export async function getProjectsWithTasksForUser(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "workspace:view");

  return db.orm.public.Project
    .where({ workspaceId })
    .include("tasks")
    .all();
}

export async function updateProjectForUser(
  userId: string,
  projectId: string,
  data: { name?: string; description?: string; status?: "ACTIVE" | "ARCHIVED" },
) {
  const { project } = await requireProjectPermission(userId, projectId, "project:update");

  return withDatabaseError(
    () => db.orm.public.Project.where({ id: project.id }).update(data),
    `update project ${projectId}`,
  );
}

export async function deleteProjectForUser(userId: string, projectId: string) {
  const { project } = await requireProjectPermission(userId, projectId, "project:delete");

  return withDatabaseError(
    () => db.orm.public.Project.where({ id: project.id }).delete(),
    `delete project ${projectId}`,
  );
}
