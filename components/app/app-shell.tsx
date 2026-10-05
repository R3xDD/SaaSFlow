"use client";

import type { ReactNode } from "react";
import {
  CheckSquare2,
  ChevronDown,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";

type Workspace = { id: string; name: string };
type Section = "home" | "projects" | "tasks" | "members" | "settings";

const navigation: Array<{ id: Section; label: string; icon: typeof Home }> = [
  { id: "home", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare2 },
  { id: "members", label: "Members", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AppShell({
  user,
  workspaces,
  workspaceId,
  activeSection,
  onSectionChange,
  onWorkspaceChange,
  children,
}: {
  user: { name: string; email: string };
  workspaces: Workspace[];
  workspaceId: string | null;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onWorkspaceChange: (workspaceId: string) => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("saasflow-theme");
    const initialDarkMode = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", initialDarkMode);
    queueMicrotask(() => setDarkMode(initialDarkMode));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("saasflow-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function selectSection(section: Section) {
    onSectionChange(section);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[var(--saas-canvas)] text-[var(--saas-ink)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col bg-[var(--saas-sidebar)] px-5 py-6 text-white lg:flex">
        <ShellBrand />
        <WorkspacePicker
          workspaces={workspaces}
          workspaceId={workspaceId}
          onWorkspaceChange={onWorkspaceChange}
        />
        <Navigation activeSection={activeSection} onSelect={selectSection} />
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-3">
            <Avatar initials={initials} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-white/50">{user.email}</p>
            </div>
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((current) => !current)} />
            <SignOutButton />
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--saas-line)] bg-[var(--saas-canvas)]/95 px-5 backdrop-blur lg:hidden">
        <button
          aria-label="Open navigation"
          className="rounded-lg p-2 text-[var(--saas-ink)] hover:bg-white"
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          <Menu size={20} />
        </button>
        <ShellBrand compact />
        <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((current) => !current)} />
        <Avatar initials={initials} />
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="flex h-full w-[280px] flex-col bg-[var(--saas-sidebar)] px-5 py-6 text-white" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <ShellBrand />
              <button aria-label="Close navigation" className="p-2 text-white/70" onClick={() => setMobileOpen(false)} type="button"><X size={20} /></button>
            </div>
            <WorkspacePicker workspaces={workspaces} workspaceId={workspaceId} onWorkspaceChange={onWorkspaceChange} />
            <Navigation activeSection={activeSection} onSelect={selectSection} />
            <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
              <Avatar initials={initials} />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-white/50">{user.email}</p></div>
              <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((current) => !current)} />
              <SignOutButton />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="min-h-screen lg:pl-[252px]">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-[var(--saas-line)] bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold ${activeSection === id ? "text-[var(--saas-blue)]" : "text-slate-400"}`} key={id} onClick={() => selectSection(id)} type="button">
            <Icon size={18} strokeWidth={activeSection === id ? 2.5 : 2} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function ShellBrand({ compact = false }: { compact?: boolean }) {
  return <div className={`flex items-center gap-2 font-bold tracking-tight ${compact ? "text-base" : "mb-8 text-lg"}`}><span className="grid size-7 place-items-center rounded-lg bg-[var(--saas-blue)] text-xs shadow-lg shadow-blue-950/30">S</span>SaaSFlow</div>;
}

function WorkspacePicker({ workspaces, workspaceId, onWorkspaceChange }: { workspaces: Workspace[]; workspaceId: string | null; onWorkspaceChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const selectedWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);
  const initials = selectedWorkspace?.name.slice(0, 2).toUpperCase() ?? "--";

  function chooseWorkspace(id: string) {
    onWorkspaceChange(id);
    setOpen(false);
  }

  return <div className="relative mb-7"><span className="mb-2 block px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Workspace</span><button aria-expanded={open} aria-haspopup="listbox" className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-3 text-left text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.12]" onClick={() => setOpen((current) => !current)} type="button"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--saas-blue)]/20 text-[10px] font-bold text-[var(--saas-blue)]">{initials}</span><span className="min-w-0 flex-1 truncate">{selectedWorkspace?.name ?? "No workspace yet"}</span><ChevronDown className={`shrink-0 text-white/45 transition ${open ? "rotate-180" : ""}`} size={16} /></button>{open ? <div aria-label="Workspaces" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-white/15 bg-[var(--saas-sidebar)]/90 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl" role="listbox">{workspaces.length ? workspaces.map((workspace) => <button aria-selected={workspace.id === workspaceId} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${workspace.id === workspaceId ? "bg-[var(--saas-blue)]/15 text-[var(--saas-blue)]" : "text-white/65 hover:bg-white/10 hover:text-white"}`} key={workspace.id} onClick={() => chooseWorkspace(workspace.id)} role="option" type="button"><span className="grid size-7 place-items-center rounded-lg bg-white/10 text-[10px] font-bold">{workspace.name.slice(0, 2).toUpperCase()}</span><span className="min-w-0 flex-1 truncate">{workspace.name}</span>{workspace.id === workspaceId ? <span className="size-1.5 rounded-full bg-[var(--saas-blue)]" /> : null}</button>) : <p className="px-3 py-3 text-xs text-white/45">Create a workspace to get started.</p>}</div> : null}</div>;
}

function Navigation({ activeSection, onSelect }: { activeSection: Section; onSelect: (section: Section) => void }) {
  return <nav className="space-y-1">{navigation.map(({ id, label, icon: Icon }) => <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${activeSection === id ? "bg-white text-[var(--saas-navy)] shadow-lg shadow-black/10" : "text-white/55 hover:bg-white/8 hover:text-white"}`} key={id} onClick={() => onSelect(id)} type="button"><Icon size={17} />{label}</button>)}</nav>;
}

function Avatar({ initials }: { initials: string }) {
  return <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--saas-lilac)] text-xs font-bold text-[var(--saas-navy)]">{initials || "U"}</span>;
}

function ThemeToggle({ darkMode, onToggle }: { darkMode: boolean; onToggle: () => void }) {
  return <button aria-label={darkMode ? "Use light theme" : "Use dark theme"} className="grid size-8 place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white" onClick={onToggle} type="button">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>;
}