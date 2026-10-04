import "server-only";

import { requireApplicationUser } from "../../src/auth/session";
import { db } from "../../src/prisma/db";
import { requireCommentPermission, requireTaskPermission } from "./authorization";
import { withDatabaseError } from "./database";

export async function createComment(taskId: string, content: string) {
  const { user } = await requireApplicationUser();
  return createCommentForUser(user.id, taskId, content);
}

export async function createCommentForUser(
  userId: string,
  taskId: string,
  content: string,
) {
  await requireTaskPermission(userId, taskId, "comment:create");

  return withDatabaseError(
    () =>
      db.orm.public.Comment.create({
        taskId,
        authorId: userId,
        content,
      }),
    "create comment",
  );
}

export async function getTaskComments(taskId: string) {
  const { user } = await requireApplicationUser();
  await requireTaskPermission(user.id, taskId, "workspace:view");

  return withDatabaseError(
    () => Array.fromAsync(db.orm.public.Comment.where({ taskId }).all()),
    `get comments for task ${taskId}`,
  );
}

export async function deleteCommentForUser(userId: string, commentId: string) {
  const { comment } = await requireCommentPermission(userId, commentId, "comment:delete");

  return withDatabaseError(
    () => db.orm.public.Comment.where({ id: comment.id }).delete(),
    `delete comment ${commentId}`,
  );
}