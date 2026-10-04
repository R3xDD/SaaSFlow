import "server-only";

import { db } from "../../src/prisma/db";
import { withDatabaseError } from "./database";
import { ForbiddenError } from "./errors";

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export type WorkspacePermission =
  | "workspace:view"
  | "project:create"
  | "project:update"
  | "project:delete"
  | "member:manage"
  | "role:change";

const permissionRoles: Record<WorkspacePermission, readonly WorkspaceRole[]> = {
  "workspace:view": ["OWNER", "ADMIN", "MEMBER"],
  "project:create": ["OWNER", "ADMIN", "MEMBER"],
  "project:update": ["OWNER", "ADMIN", "MEMBER"],
  "project:delete": ["OWNER", "ADMIN"],
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