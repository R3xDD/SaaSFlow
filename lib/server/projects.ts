import "server-only";

import { requireApiApplicationUser } from "../../src/auth/session";
import {
  createProjectForUser,
  deleteProjectForUser,
  getProjectsWithTasksForUser,
  updateProjectForUser,
} from "../data/projects";
import {
  parseCreateProjectInput,
  parseResourceIdInput,
  parseUpdateProjectInput,
} from "./validation";

export async function createProjectOperation(input: unknown) {
  const data = parseCreateProjectInput(input);
  const { user } = await requireApiApplicationUser();
  const project = await createProjectForUser(
    user.id,
    data.workspaceId,
    data.name,
    data.description,
  );

  return { success: true as const, data: project };
}

export async function updateProjectOperation(input: unknown) {
  const data = parseUpdateProjectInput(input);
  const { user } = await requireApiApplicationUser();
  const project = await updateProjectForUser(user.id, data.projectId, {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
  });

  return { success: true as const, data: project };
}

export async function deleteProjectOperation(input: unknown) {
  const projectId = parseResourceIdInput(input, "projectId");
  const { user } = await requireApiApplicationUser();
  await deleteProjectForUser(user.id, projectId);

  return { success: true as const, data: { id: projectId } };
}

export async function listProjectsOperation(input: unknown) {
  const workspaceId = parseResourceIdInput(input, "workspaceId");
  const { user } = await requireApiApplicationUser();
  const projects = await getProjectsWithTasksForUser(user.id, workspaceId);

  return { success: true as const, data: await Array.fromAsync(projects) };
}