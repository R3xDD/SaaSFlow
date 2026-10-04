import {
  parseCreateCommentInput,
  parseCreateProjectInput,
  parseCreateTaskInput,
  parseCreateWorkspaceInput,
  parseChangeMemberRoleInput,
  parseResourceIdInput,
  parseUpdateWorkspaceInput,
  parseUpdateProjectInput,
  parseUpdateTaskInput,
} from "../lib/server/validation";
import { ValidationError } from "../lib/data/errors";

const workspaceId = "00000000-0000-4000-8000-000000000001";
const projectId = "00000000-0000-4000-8000-000000000002";
const taskId = "00000000-0000-4000-8000-000000000003";

function expectValidationFailure(operation: () => unknown) {
  try {
    operation();
  } catch (error) {
    if (error instanceof ValidationError) {
      return;
    }
  }

  throw new Error("Expected invalid input to raise ValidationError.");
}

function main() {
  const project = parseCreateProjectInput({
    workspaceId,
    name: "Project Alpha",
    description: "A valid project",
  });

  const task = parseCreateTaskInput({
    projectId,
    title: "Implement API",
    assigneeId: "00000000-0000-4000-8000-000000000004",
  });

  const comment = parseCreateCommentInput({
    taskId,
    content: "A valid comment",
  });

  const workspace = parseCreateWorkspaceInput({
    name: "Team Workspace",
  });

  const projectUpdate = parseUpdateProjectInput({
    projectId,
    status: "ARCHIVED",
  });

  const taskUpdate = parseUpdateTaskInput({
    taskId,
    status: "DONE",
  });

  const workspaceUpdate = parseUpdateWorkspaceInput({
    workspaceId,
    name: "Renamed Workspace",
  });

  const roleChange = parseChangeMemberRoleInput({
    workspaceId,
    userId: "00000000-0000-4000-8000-000000000004",
    role: "MEMBER",
  });

  const deleteId = parseResourceIdInput({ projectId }, "projectId");

  if (
    project.name !== "Project Alpha" ||
    task.title !== "Implement API" ||
    comment.taskId !== taskId ||
    workspace.name !== "Team Workspace" ||
    projectUpdate.status !== "ARCHIVED" ||
    taskUpdate.status !== "DONE" ||
    workspaceUpdate.name !== "Renamed Workspace" ||
    roleChange.role !== "MEMBER" ||
    deleteId !== projectId
  ) {
    throw new Error("Valid server-operation input was not normalized correctly.");
  }

  expectValidationFailure(() => parseCreateProjectInput({ workspaceId, name: "" }));
  expectValidationFailure(() => parseCreateTaskInput({ projectId: "not-a-uuid", title: "Task" }));
  expectValidationFailure(() => parseCreateCommentInput({ taskId, content: "" }));
  expectValidationFailure(() => parseUpdateProjectInput({ projectId, status: "BROKEN" }));
  expectValidationFailure(() => parseUpdateTaskInput({ taskId, priority: "BROKEN" }));
  expectValidationFailure(() => parseUpdateWorkspaceInput({ workspaceId }));
  expectValidationFailure(() => parseChangeMemberRoleInput({ workspaceId, userId: taskId, role: "OWNER" }));
  expectValidationFailure(() => parseResourceIdInput({ projectId: "broken" }, "projectId"));

  console.log("Server-operation validation checks passed.");
}

main();