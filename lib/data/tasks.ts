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
  return createTaskForUser(user.id, projectId, title, description, assigneeId);
}

export async function createTaskForUser(
  userId: string,
  projectId: string,
  title: string,
  description?: string,
  assigneeId?: string,
) {
  const { project } = await requireProjectPermission(
    userId,
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
        createdById: userId,
        ...(assigneeId !== undefined ? { assigneeId } : {}),
        title,
        ...(description !== undefined ? { description } : {}),
      }),
    "create task",
  );
}

export async function getProjectTasks(projectId: string) {
  const { user } = await requireApplicationUser();
  return getProjectTasksForUser(user.id, projectId);
}

export async function getProjectTasksForUser(userId: string, projectId: string) {
  await requireProjectPermission(userId, projectId, "workspace:view");

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

export async function updateTaskForUser(
  userId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "DONE";
    priority?: "LOW" | "MEDIUM" | "HIGH";
    assigneeId?: string | null;
  },
) {
  const { project } = await requireTaskPermission(userId, taskId, "task:update");

  if (data.assigneeId !== undefined && data.assigneeId !== null) {
    await requireWorkspaceMembership(data.assigneeId, project.workspaceId);
  }

  return withDatabaseError(
    () => db.orm.public.Task.where({ id: taskId }).update(data),
    `update task ${taskId}`,
  );
}

export async function deleteTaskForUser(userId: string, taskId: string) {
  await requireTaskPermission(userId, taskId, "task:delete");

  return withDatabaseError(
    () => db.orm.public.Task.where({ id: taskId }).delete(),
    `delete task ${taskId}`,
  );
}