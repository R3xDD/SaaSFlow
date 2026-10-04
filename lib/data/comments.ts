import "server-only";

import { requireApplicationUser } from "../../src/auth/session";
import { db } from "../../src/prisma/db";
import { requireTaskPermission } from "./authorization";
import { withDatabaseError } from "./database";

export async function createComment(taskId: string, content: string) {
  const { user } = await requireApplicationUser();
  await requireTaskPermission(user.id, taskId, "comment:create");

  return withDatabaseError(
    () =>
      db.orm.public.Comment.create({
        taskId,
        authorId: user.id,
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