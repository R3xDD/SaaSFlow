import { DashboardApp } from "@/components/dashboard/dashboard-app";
import { getProjectsWithTasksForUser } from "@/lib/data/projects";
import { listWorkspacesForUser } from "@/lib/data/workspaces";
import { requireApplicationUser } from "@/src/auth/session";

type DashboardSection = "home" | "projects" | "tasks" | "members" | "settings";

function serializeForClient(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => serializeForClient(entry));
  }

  if (typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    const isPlainObject = prototype === Object.prototype || prototype === null;

    if (!isPlainObject) {
      if (typeof value === "object" && typeof (value as { toString?: () => string }).toString === "function") {
        const text = (value as { toString: () => string }).toString();
        if (text && text !== "[object Object]") {
          return text;
        }
      }
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeForClient(entry)]),
    );
  }

  return value;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { user } = await requireApplicationUser();
  const params = searchParams ? await searchParams : {};
  const workspaceIdParam = Array.isArray(params.workspaceId) ? params.workspaceId[0] : params.workspaceId;
  const sectionParam = Array.isArray(params.section) ? params.section[0] : params.section;

  const workspaces = await listWorkspacesForUser(user.id);
  const resolvedWorkspaceId = workspaceIdParam && workspaces.some((workspace) => workspace.id === workspaceIdParam)
    ? workspaceIdParam
    : workspaces[0]?.id ?? null;
  const normalizedSection: DashboardSection = ["home", "projects", "tasks", "members", "settings"].includes(sectionParam ?? "")
    ? (sectionParam as DashboardSection)
    : "home";
  const projects = resolvedWorkspaceId
    ? await getProjectsWithTasksForUser(user.id, resolvedWorkspaceId)
    : [];

  return (
    <DashboardApp
      initialSection={normalizedSection}
      initialWorkspaceId={resolvedWorkspaceId}
      projects={serializeForClient(projects) as typeof projects}
      user={{ name: user.name, email: user.email }}
      workspaces={serializeForClient(workspaces) as typeof workspaces}
    />
  );
}
