"use client";

import { Activity, ArrowUpRight, Check, CircleAlert, FolderKanban, ListTodo, Plus, Sparkles, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { MembersView } from "@/components/dashboard/members-view";
import { ProjectDialog } from "@/components/dashboard/project-dialog";
import { TaskDialog } from "@/components/dashboard/task-dialog";
import { WorkspaceSettings } from "@/components/dashboard/workspace-settings";

type Workspace = { id: string; name: string; description?: string | null };
type Task = { id: string; projectId?: string; title: string; description?: string | null; status: "TODO" | "IN_PROGRESS" | "DONE"; priority: "LOW" | "MEDIUM" | "HIGH" };
type Project = { id: string; name: string; description?: string | null; status: "ACTIVE" | "ARCHIVED"; tasks?: Task[] };
type Section = "home" | "projects" | "tasks" | "members" | "settings";

export function DashboardApp({
  user,
  workspaces,
  projects,
  initialWorkspaceId,
  initialSection,
}: {
  user: { name: string; email: string };
  workspaces: Workspace[];
  projects: Project[];
  initialWorkspaceId: string | null;
  initialSection: Section;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const workspaceId = workspaces.some((workspace) => workspace.id === initialWorkspaceId)
    ? initialWorkspaceId
    : workspaces[0]?.id ?? null;
  const section = initialSection;
  const [error, setError] = useState<string | null>(null);
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [workspacePending, setWorkspacePending] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deleteRequest, setDeleteRequest] = useState<{ kind: "project" | "task"; id: string; label: string } | null>(null);

  function updateQuery(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const target = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(target, { scroll: false });
  }

  const tasks = useMemo(() => projects.flatMap((project) => project.tasks ?? []), [projects]);
  const completed = tasks.filter((task) => task.status === "DONE").length;
  const selectedWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);

  async function createWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorkspacePending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description") || undefined,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      setWorkspacePending(false);
      setError(result.error?.message ?? "Unable to create workspace.");
      return;
    }

    setShowWorkspaceForm(false);
    setWorkspacePending(false);
    event.currentTarget.reset();
    const nextWorkspaceId = String(result.data?.id ?? workspaces[0]?.id ?? "");
    updateQuery({ workspaceId: nextWorkspaceId || null, section: "home" });
    router.refresh();
    toast.success(String(form.get("name")), { description: "Workspace created successfully." });
  }

  async function deleteProject(projectId: string, projectName?: string) {
    const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Unable to delete project.");
      return;
    }

    router.refresh();
    toast.error(projectName ?? "Project deleted", { description: "Project deleted." });
  }

  async function deleteTask(taskId: string, taskName?: string) {
    const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Unable to delete task.");
      return;
    }

    router.refresh();
    toast.error(taskName ?? "Task deleted", { description: "Task deleted." });
  }

  async function refreshWorkspace() {
    router.refresh();
  }

  async function deleteWorkspace(workspaceToDeleteId: string, workspaceName?: string) {
    const response = await fetch(`/api/workspaces/${workspaceToDeleteId}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Unable to delete workspace.");
      return;
    }

    const nextWorkspaceId = workspaces.find((workspace) => workspace.id !== workspaceToDeleteId)?.id ?? null;
    updateQuery({ workspaceId: nextWorkspaceId, section: "home" });
    router.refresh();
    toast.error(workspaceName ?? "Workspace deleted", { description: "Workspace deleted." });
  }

  return (
    <AppShell
      activeSection={section}
      onSectionChange={(nextSection) => {
        updateQuery({ section: nextSection });
      }}
      onWorkspaceChange={(nextWorkspaceId) => {
        const nextWorkspace = workspaces.find((workspace) => workspace.id === nextWorkspaceId);
        updateQuery({ workspaceId: nextWorkspaceId, section: "home" });
        toast.success(`Switched to ${nextWorkspace?.name ?? "workspace"}`, { description: "Loading workspace activity..." });
      }}
      user={user}
      workspaces={workspaces}
      workspaceId={workspaceId}
    >
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-7 sm:px-8 lg:px-10 lg:pt-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--saas-blue)]">{selectedWorkspace?.name ?? "Your workspace"}</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-[var(--saas-navy)] sm:text-4xl">Good morning, {user.name.split(" ")[0]}.</h1><p className="mt-2 text-sm text-slate-500">Here&apos;s what is happening with your development work.</p></div><button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--saas-blue)] px-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[var(--saas-blue-dark)] disabled:opacity-40" disabled={!workspaceId} onClick={() => setShowProjectForm(true)} type="button"><Plus size={17} />New project</button></div>
        {error ? <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><CircleAlert size={17} />{error}<button className="ml-auto font-bold" onClick={() => setError(null)} type="button">Dismiss</button></div> : null}
        {!workspaces.length ? <WorkspaceEmpty onCreate={() => setShowWorkspaceForm(true)} /> : <>
          <div className="saas-view-enter" key={`${workspaceId}-${section}`}>
            {section === "home" ? <Overview projects={projects} tasks={tasks} completed={completed} onProjects={() => updateQuery({ section: "projects" })} onTasks={() => updateQuery({ section: "tasks" })} /> : null}
            {section === "projects" ? <ProjectsView projects={projects} onCreate={() => { setEditingProject(undefined); setShowProjectForm(true); }} onEdit={(project) => { setEditingProject(project); setShowProjectForm(true); }} onDelete={(id) => { const project = projects.find((item) => item.id === id); setDeleteRequest({ kind: "project", id, label: project?.name ?? "this project" }); }} /> : null}
            {section === "tasks" ? <TasksView tasks={tasks} projects={projects} onCreate={() => { setEditingTask(undefined); setShowTaskForm(true); }} onEdit={setEditingTask} onDelete={(id) => { const task = tasks.find((item) => item.id === id); setDeleteRequest({ kind: "task", id, label: task?.title ?? "this task" }); }} /> : null}
            {section === "members" && workspaceId ? <MembersView workspaceId={workspaceId} /> : null}
            {section === "settings" && selectedWorkspace ? <WorkspaceSettings workspace={selectedWorkspace} onSaved={refreshWorkspace} onDeleted={() => deleteWorkspace(selectedWorkspace.id, selectedWorkspace.name)} /> : null}
          </div>
        </>}
      </div>
      {showWorkspaceForm ? <Modal title="Create a workspace" onClose={() => { if (!workspacePending) setShowWorkspaceForm(false); }}><form className="space-y-4" onSubmit={createWorkspace}><Field label="Workspace name" name="name" placeholder="e.g. Acme Studio" required /><Field label="Description" name="description" placeholder="What is this workspace for?" /><ModalActions onCancel={() => setShowWorkspaceForm(false)} pending={workspacePending} submit="Create workspace" /></form></Modal> : null}
      {showProjectForm && workspaceId ? <ProjectDialog project={editingProject} workspaceId={workspaceId} onClose={() => setShowProjectForm(false)} onSaved={async () => { router.refresh(); }} /> : null}
      {showTaskForm ? <TaskDialog task={editingTask} projects={projects} onClose={() => setShowTaskForm(false)} onSaved={async () => { router.refresh(); }} /> : null}
      {deleteRequest ? <ConfirmDeleteModal request={deleteRequest} onCancel={() => setDeleteRequest(null)} onConfirm={async () => { const request = deleteRequest; setDeleteRequest(null); if (request.kind === "project") await deleteProject(request.id, request.label); else await deleteTask(request.id, request.label); }} /> : null}
    </AppShell>
  );
}

function Overview({ projects, tasks, completed, onProjects, onTasks }: { projects: Project[]; tasks: Task[]; completed: number; onProjects: () => void; onTasks: () => void }) {
  const stats = [{ label: "Projects", value: projects.length, hint: "In this workspace", icon: FolderKanban, tone: "blue" }, { label: "Tasks", value: tasks.length, hint: "Across all projects", icon: ListTodo, tone: "purple" }, { label: "Completed", value: completed, hint: tasks.length ? `${Math.round((completed / tasks.length) * 100)}% of all tasks` : "Ready to start", icon: Check, tone: "green" }, { label: "In progress", value: tasks.filter((task) => task.status === "IN_PROGRESS").length, hint: "Needs attention", icon: Activity, tone: "orange" }];
  return <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, hint, icon: Icon, tone }) => <div className="rounded-2xl border border-[var(--saas-line)] bg-white p-5 shadow-[0_12px_32px_rgba(31,41,79,0.04)]" key={label}><div className="flex items-start justify-between"><span className={`grid size-9 place-items-center rounded-xl ${tone === "blue" ? "bg-blue-50 text-blue-600" : tone === "purple" ? "bg-violet-50 text-violet-600" : tone === "green" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}><Icon size={18} /></span><ArrowUpRight className="text-slate-300" size={17} /></div><p className="mt-5 text-3xl font-bold tracking-tight text-[var(--saas-navy)]">{value}</p><p className="mt-1 text-sm font-semibold text-slate-600">{label}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div>)}</div><div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><section className="rounded-2xl border border-[var(--saas-line)] bg-white p-6 shadow-[0_12px_32px_rgba(31,41,79,0.04)]"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Workspace pulse</p><h2 className="mt-1 text-xl font-bold text-[var(--saas-navy)]">Recent projects</h2></div><button className="text-sm font-bold text-[var(--saas-blue)]" onClick={onProjects} type="button">View all</button></div><div className="mt-5 space-y-2">{projects.length ? projects.slice(0, 5).map((project) => <div className="flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition hover:border-[var(--saas-line)] hover:bg-slate-50" key={project.id}><span className="grid size-10 place-items-center rounded-xl bg-[var(--saas-lilac)] text-sm font-bold text-[var(--saas-navy)]">{project.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[var(--saas-navy)]">{project.name}</p><p className="truncate text-xs text-slate-400">{project.description || "No description yet"}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">{project.status.toLowerCase()}</span></div>) : <EmptyInline label="No projects yet" action="Create your first project" onClick={onProjects} />}</div></section><section className="rounded-2xl border border-[var(--saas-line)] bg-white p-6 shadow-[0_12px_32px_rgba(31,41,79,0.04)]"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Task health</p><h2 className="mt-1 text-xl font-bold text-[var(--saas-navy)]">Tasks by status</h2></div><button className="text-sm font-bold text-[var(--saas-blue)]" onClick={onTasks} type="button">Open tasks</button></div><div className="mt-7 space-y-5">{[["To do", tasks.filter((task) => task.status === "TODO").length, "bg-blue-500"], ["In progress", tasks.filter((task) => task.status === "IN_PROGRESS").length, "bg-orange-400"], ["Done", completed, "bg-emerald-500"]].map(([label, value, color]) => <div key={label as string}><div className="mb-2 flex justify-between text-xs font-semibold"><span className="text-slate-500">{label}</span><span className="text-[var(--saas-navy)]">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${tasks.length ? (Number(value) / tasks.length) * 100 : 0}%` }} /></div></div>)}</div></section></div></>;
}

function ProjectsView({ projects, onCreate, onEdit, onDelete }: { projects: Project[]; onCreate: () => void; onEdit: (project: Project) => void; onDelete: (id: string) => void }) { return <section><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--saas-blue)]">Workspace projects</p><h2 className="mt-1 text-2xl font-bold text-[var(--saas-navy)]">Projects</h2></div><button className="inline-flex items-center gap-2 rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white" onClick={onCreate} type="button"><Plus size={16} />New project</button></div>{projects.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <article className="group rounded-2xl border border-[var(--saas-line)] bg-white p-5 shadow-[0_12px_32px_rgba(31,41,79,0.04)]" key={project.id}><div className="flex items-start justify-between"><button aria-label={`Open ${project.name}`} className="grid size-10 place-items-center rounded-xl bg-[var(--saas-lilac)] font-bold text-[var(--saas-navy)]" onClick={() => onEdit(project)} type="button">{project.name.slice(0, 1).toUpperCase()}</button><button aria-label={`Delete ${project.name}`} className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100" onClick={() => onDelete(project.id)} type="button"><Trash2 size={16} /></button></div><button className="mt-5 text-left font-bold text-[var(--saas-navy)]" onClick={() => onEdit(project)} type="button">{project.name}</button><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{project.description || "No description yet."}</p><div className="mt-5 flex items-center justify-between border-t border-[var(--saas-line)] pt-4 text-xs font-semibold text-slate-400"><span>{project.tasks?.length ?? 0} tasks</span><span className="text-emerald-600">{project.status.toLowerCase()}</span></div></article>)}</div> : <EmptyPanel label="No projects yet" action="Create your first project" onClick={onCreate} />}</section>; }

function TasksView({ tasks, projects, onCreate, onEdit, onDelete }: { tasks: Task[]; projects: Project[]; onCreate: () => void; onEdit: (task: Task) => void; onDelete: (id: string) => void }) { return <section><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--saas-blue)]">Work queue</p><h2 className="mt-1 text-2xl font-bold text-[var(--saas-navy)]">Tasks</h2></div><button className="inline-flex items-center gap-2 rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white" onClick={onCreate} type="button"><Plus size={16} />New task</button></div>{tasks.length ? <div className="overflow-hidden rounded-2xl border border-[var(--saas-line)] bg-white shadow-[0_12px_32px_rgba(31,41,79,0.04)]"><div className="hidden grid-cols-[1fr_140px_120px_80px] border-b border-[var(--saas-line)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:grid"><span>Task</span><span>Status</span><span>Priority</span><span /></div>{tasks.map((task) => <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[var(--saas-line)] px-5 py-4 last:border-0 sm:grid-cols-[1fr_140px_120px_80px]" key={task.id}><button className="min-w-0 text-left" onClick={() => onEdit(task)} type="button"><p className="truncate text-sm font-bold text-[var(--saas-navy)]">{task.title}</p><p className="mt-1 truncate text-xs text-slate-400">{projects.find((project) => project.tasks?.some((item) => item.id === task.id))?.name ?? "Project"}</p></button><span className="text-xs font-semibold text-slate-500">{task.status.replace("_", " ").toLowerCase()}</span><span className={`text-xs font-bold ${task.priority === "HIGH" ? "text-red-500" : task.priority === "MEDIUM" ? "text-orange-500" : "text-slate-400"}`}>{task.priority.toLowerCase()}</span><button aria-label={`Delete ${task.title}`} className="justify-self-end rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500" onClick={() => onDelete(task.id)} type="button"><Trash2 size={15} /></button></div>)}</div> : <EmptyPanel label="No tasks yet" action="Create a task" onClick={onCreate} />}</section>; }

function WorkspaceEmpty({ onCreate }: { onCreate: () => void }) { return <EmptyPanel label="Start with a workspace" action="Create workspace" onClick={onCreate} description="Your workspace is where projects, tasks, and teammates come together." />; }
function EmptyPanel({ label, action, onClick, description }: { label: string; action: string; onClick?: () => void; description?: string }) { return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--saas-lilac)] text-[var(--saas-blue)]"><Sparkles size={20} /></span><h3 className="mt-4 font-bold text-[var(--saas-navy)]">{label}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{description || "A clear space for your next piece of work."}</p>{onClick ? <button className="mt-5 rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white" onClick={onClick} type="button">{action}</button> : null}</div>; }
function EmptyInline({ label, action, onClick }: { label: string; action: string; onClick: () => void }) { return <div className="py-8 text-center"><p className="text-sm font-semibold text-slate-500">{label}</p><button className="mt-2 text-sm font-bold text-[var(--saas-blue)]" onClick={onClick} type="button">{action}</button></div>; }
function ConfirmDeleteModal({ request, onCancel, onConfirm }: { request: { kind: "project" | "task"; label: string }; onCancel: () => void; onConfirm: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  async function confirm() { setPending(true); await onConfirm(); }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--saas-sidebar)]/70 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-red-200/20 bg-white p-6 shadow-[0_24px_80px_rgba(20,40,30,0.35)] dark:bg-[#142b21]"><div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"><Trash2 size={19} /></div><h2 className="mt-5 text-xl font-bold text-[var(--saas-navy)]">Delete {request.kind}?</h2><p className="mt-2 text-sm leading-6 text-slate-500">You&apos;re about to delete <span className="font-bold text-[var(--saas-navy)]">{request.label}</span>. This action cannot be undone.</p><div className="mt-7 flex justify-end gap-2"><button className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-100/10" disabled={pending} onClick={onCancel} type="button">Cancel</button><button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_10px_24px_-8px_rgba(220,38,38,0.8)] disabled:opacity-50" disabled={pending} onClick={() => void confirm()} type="button"><Trash2 size={15} />{pending ? "Deleting..." : "Delete permanently"}</button></div></div></div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--saas-navy)]/45 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold text-[var(--saas-navy)]">{title}</h2><button aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} type="button">×</button></div>{children}</div></div>; }
function Field({ label, name, placeholder, required = false }: { label: string; name: string; placeholder: string; required?: boolean }) { return <label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">{label}<input className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[var(--saas-blue)] focus:bg-white focus:ring-4 focus:ring-blue-100" name={name} placeholder={placeholder} required={required} /></label>; }
function ModalActions({ onCancel, submit, pending = false }: { onCancel: () => void; submit: string; pending?: boolean }) { return <div className="flex justify-end gap-2 pt-3"><button className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100" disabled={pending} onClick={onCancel} type="button">Cancel</button><button className="rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white" disabled={pending} type="submit">{pending ? "Creating..." : submit}</button></div>; }