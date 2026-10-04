import "server-only";

import { requireApiApplicationUser } from "../../src/auth/session";
import { createWorkspaceForUser, deleteWorkspaceForUser, updateWorkspaceForUser } from "../data/workspaces";
import { parseCreateWorkspaceInput, parseResourceIdInput, parseUpdateWorkspaceInput } from "./validation";

export async function createWorkspaceOperation(input: unknown) {
  const data = parseCreateWorkspaceInput(input);
  const { user } = await requireApiApplicationUser();
  const workspace = await createWorkspaceForUser(user.id, data.name, data.description);

  return { success: true as const, data: workspace };
}

export async function updateWorkspaceOperation(input: unknown) {
  const data = parseUpdateWorkspaceInput(input);
  const { user } = await requireApiApplicationUser();
  const workspace = await updateWorkspaceForUser(user.id, data.workspaceId, {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
  });

  return { success: true as const, data: workspace };
}

export async function deleteWorkspaceOperation(input: unknown) {
  const workspaceId = parseResourceIdInput(input, "workspaceId");
  const { user } = await requireApiApplicationUser();
  await deleteWorkspaceForUser(user.id, workspaceId);

  return { success: true as const, data: { id: workspaceId } };
}