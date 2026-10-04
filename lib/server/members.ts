import "server-only";

import { requireApiApplicationUser } from "../../src/auth/session";
import {
  changeMemberRoleForUser,
  listWorkspaceMembersForUser,
  removeMemberForUser,
} from "../data/members";
import { parseChangeMemberRoleInput, parseResourceIdInput } from "./validation";

export async function listMembersOperation(input: unknown) {
  const workspaceId = parseResourceIdInput(input, "workspaceId");
  const { user } = await requireApiApplicationUser();
  const members = await listWorkspaceMembersForUser(user.id, workspaceId);

  return { success: true as const, data: await Array.fromAsync(members) };
}

export async function changeMemberRoleOperation(input: unknown) {
  const data = parseChangeMemberRoleInput(input);
  const { user } = await requireApiApplicationUser();
  const membership = await changeMemberRoleForUser(user.id, data.workspaceId, data.userId, data.role);

  return { success: true as const, data: membership };
}

export async function removeMemberOperation(input: unknown) {
  const workspaceId = parseResourceIdInput(input, "workspaceId");
  const userId = parseResourceIdInput(input, "userId");
  const { user } = await requireApiApplicationUser();
  await removeMemberForUser(user.id, workspaceId, userId);

  return { success: true as const, data: { userId, workspaceId } };
}