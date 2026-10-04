import "server-only";

import { requireApiApplicationUser } from "../../src/auth/session";
import { createCommentForUser, deleteCommentForUser } from "../data/comments";
import { parseCreateCommentInput, parseResourceIdInput } from "./validation";

export async function createCommentOperation(input: unknown) {
  const data = parseCreateCommentInput(input);
  const { user } = await requireApiApplicationUser();
  const comment = await createCommentForUser(user.id, data.taskId, data.content);

  return { success: true as const, data: comment };
}

export async function deleteCommentOperation(input: unknown) {
  const commentId = parseResourceIdInput(input, "commentId");
  const { user } = await requireApiApplicationUser();
  await deleteCommentForUser(user.id, commentId);

  return { success: true as const, data: { id: commentId } };
}