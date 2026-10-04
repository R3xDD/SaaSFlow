import { ValidationError } from "../data/errors";

export type CreateProjectInput = {
  workspaceId: string;
  name: string;
  description?: string;
};

export type CreateWorkspaceInput = {
  name: string;
  description?: string;
};

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
};

export type CreateCommentInput = {
  taskId: string;
  content: string;
};

export type UpdateProjectInput = {
  projectId: string;
  name?: string;
  description?: string;
  status?: "ACTIVE" | "ARCHIVED";
};

export type UpdateWorkspaceInput = {
  workspaceId: string;
  name?: string;
  description?: string;
};

export type ChangeMemberRoleInput = {
  workspaceId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
};

export type UpdateTaskInput = {
  taskId: string;
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  assigneeId?: string | null;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseCreateProjectInput(input: unknown): CreateProjectInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ValidationError("Request body must be an object.");
  }

  const value = input as Record<string, unknown>;
  const issues: string[] = [];
  const workspaceId = typeof value.workspaceId === "string"
    ? value.workspaceId.trim()
    : "";
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const description = value.description === undefined
    ? undefined
    : typeof value.description === "string"
      ? value.description.trim()
      : null;

  if (!uuidPattern.test(workspaceId)) {
    issues.push("workspaceId must be a valid UUID.");
  }

  if (name.length < 1 || name.length > 100) {
    issues.push("name must contain between 1 and 100 characters.");
  }

  if (description === null || (description !== undefined && description.length > 1000)) {
    issues.push("description must be a string with at most 1000 characters.");
  }

  if (issues.length > 0) {
    throw new ValidationError("Project input is invalid.", issues);
  }

  const normalizedDescription = description === null ? undefined : description;

  return {
    workspaceId,
    name,
    ...(normalizedDescription !== undefined ? { description: normalizedDescription } : {}),
  };
}

function readObject(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ValidationError("Request body must be an object.");
  }

  return input as Record<string, unknown>;
}

function readUuid(value: unknown, field: string, issues: string[]) {
  const uuid = typeof value === "string" ? value.trim() : "";

  if (!uuidPattern.test(uuid)) {
    issues.push(`${field} must be a valid UUID.`);
  }

  return uuid;
}

function readText(
  value: unknown,
  field: string,
  maximum: number,
  issues: string[],
) {
  const text = typeof value === "string" ? value.trim() : "";

  if (text.length < 1 || text.length > maximum) {
    issues.push(`${field} must contain between 1 and ${maximum} characters.`);
  }

  return text;
}

export function parseCreateTaskInput(input: unknown): CreateTaskInput {
  const value = readObject(input);
  const issues: string[] = [];
  const projectId = readUuid(value.projectId, "projectId", issues);
  const title = readText(value.title, "title", 200, issues);
  const description = value.description === undefined
    ? undefined
    : typeof value.description === "string"
      ? value.description.trim()
      : null;
  const assigneeId = value.assigneeId === undefined
    ? undefined
    : readUuid(value.assigneeId, "assigneeId", issues);

  if (description === null || (description !== undefined && description.length > 2000)) {
    issues.push("description must be a string with at most 2000 characters.");
  }

  if (issues.length > 0) {
    throw new ValidationError("Task input is invalid.", issues);
  }

  const normalizedDescription = description === null ? undefined : description;

  return {
    projectId,
    title,
    ...(normalizedDescription !== undefined ? { description: normalizedDescription } : {}),
    ...(assigneeId !== undefined ? { assigneeId } : {}),
  };
}

export function parseCreateCommentInput(input: unknown): CreateCommentInput {
  const value = readObject(input);
  const issues: string[] = [];
  const taskId = readUuid(value.taskId, "taskId", issues);
  const content = readText(value.content, "content", 5000, issues);

  if (issues.length > 0) {
    throw new ValidationError("Comment input is invalid.", issues);
  }

  return { taskId, content };
}

export function parseUpdateProjectInput(input: unknown): UpdateProjectInput {
  const value = readObject(input);
  const issues: string[] = [];
  const projectId = readUuid(value.projectId, "projectId", issues);
  const name = value.name === undefined ? undefined : readText(value.name, "name", 100, issues);
  const description = value.description === undefined
    ? undefined
    : typeof value.description === "string" ? value.description.trim() : null;
  const status = value.status === undefined
    ? undefined
    : value.status === "ACTIVE" || value.status === "ARCHIVED"
      ? value.status
      : null;

  if (description === null || (description !== undefined && description.length > 1000)) {
    issues.push("description must be a string with at most 1000 characters.");
  }
  if (status === null) {
    issues.push("status must be ACTIVE or ARCHIVED.");
  }
  if (name === undefined && description === undefined && status === undefined) {
    issues.push("at least one project field must be provided.");
  }
  if (issues.length > 0) {
    throw new ValidationError("Project update input is invalid.", issues);
  }

  return {
    projectId,
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined && description !== null ? { description } : {}),
    ...(status !== undefined && status !== null ? { status } : {}),
  };
}

export function parseUpdateWorkspaceInput(input: unknown): UpdateWorkspaceInput {
  const value = readObject(input);
  const issues: string[] = [];
  const workspaceId = readUuid(value.workspaceId, "workspaceId", issues);
  const name = value.name === undefined ? undefined : readText(value.name, "name", 100, issues);
  const description = value.description === undefined
    ? undefined
    : typeof value.description === "string" ? value.description.trim() : null;

  if (description === null || (description !== undefined && description.length > 1000)) {
    issues.push("description must be a string with at most 1000 characters.");
  }
  if (name === undefined && description === undefined) {
    issues.push("at least one workspace field must be provided.");
  }
  if (issues.length > 0) {
    throw new ValidationError("Workspace update input is invalid.", issues);
  }

  return {
    workspaceId,
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined && description !== null ? { description } : {}),
  };
}

export function parseChangeMemberRoleInput(input: unknown): ChangeMemberRoleInput {
  const value = readObject(input);
  const issues: string[] = [];
  const workspaceId = readUuid(value.workspaceId, "workspaceId", issues);
  const userId = readUuid(value.userId, "userId", issues);
  const role = value.role === "ADMIN" || value.role === "MEMBER" ? value.role : null;

  if (role === null) {
    issues.push("role must be ADMIN or MEMBER.");
  }
  if (issues.length > 0) {
    throw new ValidationError("Member role input is invalid.", issues);
  }

  return { workspaceId, userId, role: role as "ADMIN" | "MEMBER" };
}

export function parseUpdateTaskInput(input: unknown): UpdateTaskInput {
  const value = readObject(input);
  const issues: string[] = [];
  const taskId = readUuid(value.taskId, "taskId", issues);
  const title = value.title === undefined ? undefined : readText(value.title, "title", 200, issues);
  const description = value.description === undefined
    ? undefined
    : typeof value.description === "string" ? value.description.trim() : null;
  const status = value.status === undefined ? undefined : value.status;
  const priority = value.priority === undefined ? undefined : value.priority;
  const assigneeId = value.assigneeId === null
    ? null
    : value.assigneeId === undefined ? undefined : readUuid(value.assigneeId, "assigneeId", issues);

  if (description === null || (description !== undefined && description.length > 2000)) {
    issues.push("description must be a string with at most 2000 characters.");
  }
  if (status !== undefined && !["TODO", "IN_PROGRESS", "DONE"].includes(String(status))) {
    issues.push("status must be TODO, IN_PROGRESS, or DONE.");
  }
  if (priority !== undefined && !["LOW", "MEDIUM", "HIGH"].includes(String(priority))) {
    issues.push("priority must be LOW, MEDIUM, or HIGH.");
  }
  if (title === undefined && description === undefined && status === undefined && priority === undefined && assigneeId === undefined) {
    issues.push("at least one task field must be provided.");
  }
  if (issues.length > 0) {
    throw new ValidationError("Task update input is invalid.", issues);
  }

  return {
    taskId,
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined && description !== null ? { description } : {}),
    ...(status !== undefined ? { status: status as UpdateTaskInput["status"] } : {}),
    ...(priority !== undefined ? { priority: priority as UpdateTaskInput["priority"] } : {}),
    ...(assigneeId !== undefined ? { assigneeId } : {}),
  };
}

export function parseResourceIdInput(input: unknown, field: string) {
  const value = readObject(input);
  const issues: string[] = [];
  const id = readUuid(value[field], field, issues);

  if (issues.length > 0) {
    throw new ValidationError("Resource identifier is invalid.", issues);
  }

  return id;
}

export function parseCreateWorkspaceInput(input: unknown): CreateWorkspaceInput {
  const value = readObject(input);
  const issues: string[] = [];
  const name = readText(value.name, "name", 100, issues);
  const description = value.description === undefined
    ? undefined
    : typeof value.description === "string" ? value.description.trim() : null;

  if (description === null || (description !== undefined && description.length > 1000)) {
    issues.push("description must be a string with at most 1000 characters.");
  }
  if (issues.length > 0) {
    throw new ValidationError("Workspace input is invalid.", issues);
  }

  return {
    name,
    ...(description !== undefined && description !== null ? { description } : {}),
  };
}