import "server-only";

import { db } from "../../src/prisma/db";
import { withDatabaseError } from "./database";
import { ForbiddenError, NotFoundError } from "./errors";

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export type WorkspacePermission =
  | "workspace:view"
  | "workspace:update"
  | "workspace:delete"
  | "project:create"
  | "project:update"
  | "project:delete"
  | "task:create"
  | "task:update"
  | "task:delete"
  | "comment:create"
  | "comment:delete"
  | "member:manage"
  | "role:change";

const permissionRoles: Record<WorkspacePermission, readonly WorkspaceRole[]> = {
  "workspace:view": ["OWNER", "ADMIN", "MEMBER"],
  "workspace:update": ["OWNER", "ADMIN"],
  "workspace:delete": ["OWNER"],
  "project:create": ["OWNER", "ADMIN", "MEMBER"],
  "project:update": ["OWNER", "ADMIN", "MEMBER"],
  "project:delete": ["OWNER", "ADMIN"],
  "task:create": ["OWNER", "ADMIN", "MEMBER"],
  "task:update": ["OWNER", "ADMIN", "MEMBER"],
  "task:delete": ["OWNER", "ADMIN"],
  "comment:create": ["OWNER", "ADMIN", "MEMBER"],
  "comment:delete": ["OWNER", "ADMIN"],
  "member:manage": ["OWNER", "ADMIN"],
  "role:change": ["OWNER"],
};

export async function requireWorkspaceMembership(
  userId: string,
  workspaceId: string,
) {
  const membership = await withDatabaseError(
    () => db.orm.public.Membership.first({ userId, workspaceId }),
    `get membership for workspace ${workspaceId}`,
  );

  if (!membership) {
    throw new ForbiddenError("You are not a member of this workspace.");
  }

  return membership;
}

export async function requireProjectPermission(
  userId: string,
  projectId: string,
  permission: WorkspacePermission,
) {
  const project = await withDatabaseError(
    () => db.orm.public.Project.first({ id: projectId }),
    `get project ${projectId}`,
  );

  if (!project) {
    throw new NotFoundError("Project", projectId);
  }

  const membership = await requireWorkspacePermission(
    userId,
    project.workspaceId,
    permission,
  );

  return { membership, project };
}

export async function requireTaskPermission(
  userId: string,
  taskId: string,
  permission: WorkspacePermission,
) {
  const task = await withDatabaseError(
    () => db.orm.public.Task.first({ id: taskId }),
    `get task ${taskId}`,
  );

  if (!task) {
    throw new NotFoundError("Task", taskId);
  }

  const project = await withDatabaseError(
    () => db.orm.public.Project.first({ id: task.projectId }),
    `get task project ${task.projectId}`,
  );

  if (!project) {
    throw new NotFoundError("Project", task.projectId);
  }

  const membership = await requireWorkspacePermission(
    userId,
    project.workspaceId,
    permission,
  );

  return { membership, project, task };
}

export async function requireCommentPermission(
  userId: string,
  commentId: string,
  permission: WorkspacePermission,
) {
  const comment = await withDatabaseError(
    () => db.orm.public.Comment.first({ id: commentId }),
    `get comment ${commentId}`,
  );

  if (!comment) {
    throw new NotFoundError("Comment", commentId);
  }

  const result = await requireTaskPermission(userId, comment.taskId, permission);

  return { ...result, comment };
}

export async function requireWorkspacePermission(
  userId: string,
  workspaceId: string,
  permission: WorkspacePermission,
) {
  const membership = await requireWorkspaceMembership(userId, workspaceId);
  const allowedRoles = permissionRoles[permission];

  if (!allowedRoles.includes(membership.role)) {
    throw new ForbiddenError("Your workspace role cannot perform this action.");
  }

  return membership;
}