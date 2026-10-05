"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserRound, UserX } from "lucide-react";

type Member = { id: string; userId: string; role: "OWNER" | "ADMIN" | "MEMBER"; user?: { name: string; email: string } };

export function MembersView({ workspaceId }: { workspaceId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolePending, setRolePending] = useState<string | null>(null);
  const [removePending, setRemovePending] = useState<string | null>(null);
  async function load() { const response = await fetch(`/api/workspaces/${workspaceId}/members`, { cache: "no-store" }); const result = await response.json(); if (!response.ok) throw new Error(result.error?.message ?? "Unable to load members."); setMembers(result.data); }
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/members`, { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message ?? "Unable to load members.");
        if (active) setMembers(result.data);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load members.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [workspaceId]);
  async function changeRole(event: FormEvent<HTMLSelectElement>, userId: string) { setRolePending(userId); const response = await fetch(`/api/workspaces/${workspaceId}/members`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role: event.currentTarget.value }) }); if (!response.ok) { const result = await response.json(); setError(result.error?.message ?? "Unable to change role."); setRolePending(null); return; } await load(); setRolePending(null); }
  async function remove(userId: string) { if (!window.confirm("Remove this member from the workspace?")) return; setRemovePending(userId); const response = await fetch(`/api/workspaces/${workspaceId}/members`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) }); if (!response.ok) { const result = await response.json(); setError(result.error?.message ?? "Unable to remove member."); setRemovePending(null); return; } await load(); setRemovePending(null); }
  return <section><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--saas-blue)]">Workspace access</p><h2 className="mt-1 text-2xl font-bold text-[var(--saas-navy)]">Members</h2></div>{error ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}<div className="overflow-hidden rounded-2xl border border-[var(--saas-line)] bg-white shadow-[0_12px_32px_rgba(31,41,79,0.04)]">{loading ? <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div className="h-12 animate-pulse rounded-xl bg-slate-100" key={item} />)}</div> : members.length ? members.map((member) => <div className="flex items-center gap-4 border-b border-[var(--saas-line)] px-5 py-4 last:border-0" key={member.id}><span className="grid size-10 place-items-center rounded-full bg-[var(--saas-lilac)] text-[var(--saas-blue)]"><UserRound size={18} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[var(--saas-navy)]">{member.user?.name ?? "Workspace member"}</p><p className="truncate text-xs text-slate-400">{member.user?.email ?? member.userId}</p></div><select aria-label="Member role" className="rounded-lg border border-[var(--saas-line)] bg-slate-50 px-2 py-2 text-xs font-bold text-slate-600" defaultValue={member.role} disabled={member.role === "OWNER" || rolePending === member.userId} onChange={(event) => void changeRole(event, member.userId)}><option value="OWNER">Owner</option><option value="ADMIN">Admin</option><option value="MEMBER">Member</option></select>{member.role !== "OWNER" ? <button aria-label="Remove member" className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500" disabled={removePending === member.userId} onClick={() => void remove(member.userId)} type="button"><UserX size={17} /></button> : null}</div>) : <div className="p-10 text-center text-sm text-slate-500">No members yet.</div>}</div></section>;
}