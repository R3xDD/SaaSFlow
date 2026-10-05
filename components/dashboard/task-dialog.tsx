"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Project = { id: string; name: string };
type Task = { id: string; projectId?: string; title: string; description?: string | null; status: "TODO" | "IN_PROGRESS" | "DONE"; priority: "LOW" | "MEDIUM" | "HIGH" };

export function TaskDialog({ task, projects, onClose, onSaved }: { task?: Task; projects: Project[]; onClose: () => void; onSaved: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const projectId = String(form.get("projectId") ?? "");
    const response = await fetch(task ? `/api/tasks/${task.id}` : "/api/tasks", {
      method: task ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task ? { taskId: task.id, title: form.get("title"), description: form.get("description"), status: form.get("status"), priority: form.get("priority") } : { projectId, title: form.get("title"), description: form.get("description"), priority: form.get("priority") }),
    });
    const result = await response.json();
    setPending(false);
    if (!response.ok) { setError(result.error?.message ?? "Unable to save task."); toast.error("Task save failed"); return; }
    await onSaved();
    toast.success(String(form.get("title")), { description: task ? "Task updated successfully." : "Task created successfully." });
    onClose();
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--saas-navy)]/45 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--saas-blue)]">Work queue</p><h2 className="mt-1 text-xl font-bold text-[var(--saas-navy)]">{task ? "Edit task" : "Create a task"}</h2></div><button aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} type="button">×</button></div><form className="space-y-4" onSubmit={submit}>{!task ? <label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Project<select className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm outline-none" name="projectId" required><option value="">Choose a project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label> : null}<label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Task title<input className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm outline-none focus:border-[var(--saas-blue)] focus:bg-white focus:ring-4 focus:ring-blue-100" defaultValue={task?.title} name="title" required /></label><label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Description<textarea className="min-h-20 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[var(--saas-blue)] focus:bg-white focus:ring-4 focus:ring-blue-100" defaultValue={task?.description ?? ""} name="description" /></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Status<select className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm outline-none" defaultValue={task?.status ?? "TODO"} name="status"><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select></label><label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Priority<select className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm outline-none" defaultValue={task?.priority ?? "MEDIUM"} name="priority"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label></div>{error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}<div className="flex justify-end gap-2 pt-3"><button className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100" onClick={onClose} type="button">Cancel</button><button className="rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Saving..." : task ? "Save changes" : "Create task"}</button></div></form></div></div>;
}