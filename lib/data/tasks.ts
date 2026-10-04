import "server-only";

import { requireApplicationUser } from "../../src/auth/session";
import { db } from "../../src/prisma/db";
import {
  requireProjectPermission,
  requireTaskPermission,
  requireWorkspaceMembership,
} from "./authorization";
import { withDatabaseError } from "./database";

export async function createTask(
  projectId: string,
  title: string,
  description?: string,
  assigneeId?: string,
) {
  const { user } = await requireApplicationUser();
  const { project } = await requireProjectPermission(
    user.id,
    projectId,
    "task:create",
  );

  if (assigneeId !== undefined) {
    await requireWorkspaceMembership(assigneeId, project.workspaceId);
  }

  return withDatabaseError(
    () =>
      db.orm.public.Task.create({
        projectId,
        createdById: user.id,
        ...(assigneeId !== undefined ? { assigneeId } : {}),
        title,
        ...(description !== undefined ? { description } : {}),
      }),
    "create task",
  );
}

export async function getProjectTasks(projectId: string) {
  const { user } = await requireApplicationUser();
  await requireProjectPermission(user.id, projectId, "workspace:view");

  return withDatabaseError(
    () => Array.fromAsync(db.orm.public.Task.where({ projectId }).all()),
    `get tasks for project ${projectId}`,
  );
}

export async function getTask(taskId: string) {
  const { user } = await requireApplicationUser();
  const { task } = await requireTaskPermission(
    user.id,
    taskId,
    "workspace:view",
  );

  return task;
}