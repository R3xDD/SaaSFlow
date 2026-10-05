import "server-only";

import { db } from "../../src/prisma/db";
import { requireWorkspaceMembership, requireWorkspacePermission } from "./authorization";
import { withDatabaseError } from "./database";
import { ForbiddenError, NotFoundError } from "./errors";

export async function listWorkspaceMembersForUser(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "workspace:view");

  return withDatabaseError(
    () => Array.fromAsync(db.orm.public.Membership.where({ workspaceId }).include("user").all()),
    `list members for workspace ${workspaceId}`,
  );
}

export async function changeMemberRoleForUser(
  actorId: string,
  workspaceId: string,
  targetUserId: string,
  role: "ADMIN" | "MEMBER",
) {
  await requireWorkspacePermission(actorId, workspaceId, "role:change");
  const membership = await requireWorkspaceMembership(targetUserId, workspaceId);

  if (membership.role === "OWNER") {
    throw new ForbiddenError("The workspace owner role cannot be changed.");
  }

  return withDatabaseError(
    () => db.orm.public.Membership.where({ id: membership.id }).update({ role }),
    `change role for workspace member ${targetUserId}`,
  );
}

export async function removeMemberForUser(
  actorId: string,
  workspaceId: string,
  targetUserId: string,
) {
  await requireWorkspacePermission(actorId, workspaceId, "member:manage");
  const membership = await withDatabaseError(
    () => db.orm.public.Membership.first({ userId: targetUserId, workspaceId }),
    `get workspace member ${targetUserId}`,
  );

  if (!membership) {
    throw new NotFoundError("Membership", targetUserId);
  }
  if (membership.role === "OWNER") {
    throw new ForbiddenError("The workspace owner cannot be removed.");
  }

  return withDatabaseError(
    () => db.orm.public.Membership.where({ id: membership.id }).delete(),
    `remove workspace member ${targetUserId}`,
  );
}