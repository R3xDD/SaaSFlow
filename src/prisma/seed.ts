import { db } from "./db";
import { Temporal } from "temporal-polyfill";

async function main() {
  const existing = await db.orm.public.User.select("id").all();

  if (existing.length > 0) {
    console.log("Database already has data. Seed skipped.");
    return;
  }

  const user = await db.orm.public.User.create({
    email: "youssef@saasflow.dev",
    name: "Youssef",
    passwordHash: "demo-hash",
  });

  const workspace = await db.orm.public.Workspace.create({
    name: "SaaSFlow Team",
    description: "Development workspace for SaaSFlow",
  });

  await db.orm.public.Membership.create({
    userId: user.id,
    workspaceId: workspace.id,
    role: "OWNER",
  });

  const project = await db.orm.public.Project.create({
    workspaceId: workspace.id,
    createdById: user.id,
    name: "SaaSFlow Development",
    description: "Main SaaSFlow project",
    status: "ACTIVE",
  });

  const task1 = await db.orm.public.Task.create({
    projectId: project.id,
    createdById: user.id,
    assigneeId: user.id,
    title: "Build landing page",
    description: "Create the public SaaSFlow landing page",
    status: "DONE",
    priority: "HIGH",
  });

  const task2 = await db.orm.public.Task.create({
    projectId: project.id,
    createdById: user.id,
    assigneeId: user.id,
    title: "Build dashboard",
    description: "Create the authenticated application dashboard",
    status: "IN_PROGRESS",
    priority: "HIGH",
  });

  const task3 = await db.orm.public.Task.create({
    projectId: project.id,
    createdById: user.id,
    title: "Add search",
    description: "Implement task search",
    status: "TODO",
    priority: "MEDIUM",
  });

  const frontendLabel = await db.orm.public.Label.create({
    workspaceId: workspace.id,
    name: "frontend",
    color: "blue",
  });

  const backendLabel = await db.orm.public.Label.create({
    workspaceId: workspace.id,
    name: "backend",
    color: "green",
  });

  await db.orm.public.TaskLabel.create({
    taskId: task1.id,
    labelId: frontendLabel.id,
  });

  await db.orm.public.TaskLabel.create({
    taskId: task2.id,
    labelId: frontendLabel.id,
  });

  await db.orm.public.TaskLabel.create({
    taskId: task2.id,
    labelId: backendLabel.id,
  });

  await db.orm.public.Comment.create({
    taskId: task2.id,
    authorId: user.id,
    content: "Dashboard implementation is in progress.",
  });

  const expiresAt = Temporal.Instant.from(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  );

  await db.orm.public.Invitation.create({
    workspaceId: workspace.id,
    invitedById: user.id,
    email: "developer@saasflow.dev",
    role: "MEMBER",
    tokenHash: "demo-invitation-token",
    expiresAt,
  });

  await db.orm.public.Activity.create({
    workspaceId: workspace.id,
    actorId: user.id,
    action: "TASK_CREATED",
    entityType: "Task",
    entityId: task2.id,
    metadata: {
      source: "seed",
    },
  });

  console.log("✅ SaaSFlow database seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });