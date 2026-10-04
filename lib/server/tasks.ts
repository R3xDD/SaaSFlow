import "server-only";

import { requireApiApplicationUser } from "../../src/auth/session";
import {
  createTaskForUser,
  deleteTaskForUser,
  getProjectTasksForUser,
  updateTaskForUser,
} from "../data/tasks";
import { parseCreateTaskInput, parseResourceIdInput, parseUpdateTaskInput } from "./validation";

export async function createTaskOperation(input: unknown) {
  const data = parseCreateTaskInput(input);
  const { user } = await requireApiApplicationUser();
  const task = await createTaskForUser(
    user.id,
    data.projectId,
    data.title,
    data.description,
    data.assigneeId,
  );

  return { success: true as const, data: task };
}

export async function updateTaskOperation(input: unknown) {
  const data = parseUpdateTaskInput(input);
  const { user } = await requireApiApplicationUser();
  const task = await updateTaskForUser(user.id, data.taskId, {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.priority !== undefined ? { priority: data.priority } : {}),
    ...(data.assigneeId !== undefined ? { assigneeId: data.assigneeId } : {}),
  });

  return { success: true as const, data: task };
}

export async function deleteTaskOperation(input: unknown) {
  const taskId = parseResourceIdInput(input, "taskId");
  const { user } = await requireApiApplicationUser();
  await deleteTaskForUser(user.id, taskId);

  return { success: true as const, data: { id: taskId } };
}

export async function listTasksOperation(input: unknown) {
  const projectId = parseResourceIdInput(input, "projectId");
  const { user } = await requireApiApplicationUser();
  const tasks = await getProjectTasksForUser(user.id, projectId);

  return { success: true as const, data: await Array.fromAsync(tasks) };
}