"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Project = { id: string; name: string; description?: string | null; status: "ACTIVE" | "ARCHIVED" };

export function ProjectDialog({ project, workspaceId, onClose, onSaved }: { project?: Project; workspaceId: string; onClose: () => void; onSaved: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch(project ? `/api/projects/${project.id}` : "/api/projects", {
      method: project ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(project ? { name: form.get("name"), description: form.get("description"), status: form.get("status") } : { workspaceId, name: form.get("name"), description: form.get("description") }),
      }),
    });
    const result = await response.json();
    setPending(false);
    if (!response.ok) { setError(result.error?.message ?? "Unable to save project."); toast.error("Project save failed"); return; }
    await onSaved();
    toast.success(String(form.get("name")), { description: project ? "Project updated successfully." : "Project created successfully." });
    onClose();
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--saas-navy)]/45 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--saas-blue)]">Project workspace</p><h2 className="mt-1 text-xl font-bold text-[var(--saas-navy)]">{project ? "Edit project" : "Create a project"}</h2></div><button aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} type="button">×</button></div><form className="space-y-4" onSubmit={submit}><label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Project name<input className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm outline-none focus:border-[var(--saas-blue)] focus:bg-white focus:ring-4 focus:ring-blue-100" defaultValue={project?.name} name="name" required /></label><label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Description<textarea className="min-h-24 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[var(--saas-blue)] focus:bg-white focus:ring-4 focus:ring-blue-100" defaultValue={project?.description ?? ""} name="description" /></label>{project ? <label className="grid gap-2 text-sm font-semibold text-[var(--saas-navy)]">Status<select className="h-11 rounded-xl border border-[var(--saas-line)] bg-slate-50 px-3 text-sm outline-none" defaultValue={project.status} name="status"><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select></label> : null}{error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}<div className="flex justify-end gap-2 pt-3"><button className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100" onClick={onClose} type="button">Cancel</button><button className="rounded-xl bg-[var(--saas-blue)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Saving..." : project ? "Save changes" : "Create project"}</button></div></form></div></div>;
}