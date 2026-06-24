import { Project, Contact, DEPARTMENTS } from "./types";

const PROJECTS_KEY = "te-wm-projects";
const CONTACTS_KEY = "te-wm-contacts";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function loadContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONTACTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function ensurePhaseTasks(p: Project): Project {
  const phaseTasks = { ...p.phaseTasks };
  for (const dept of DEPARTMENTS) {
    if (!phaseTasks[dept]) {
      const d = p.departments[dept];
      phaseTasks[dept] = {
        done: false,
        assignee: d?.pm || "",
        hrs: d?.hrs ?? null,
        due: "",
        notes: "",
      };
    }
  }
  return { ...p, phaseTasks };
}

export function totalHrs(p: Project): number {
  return Object.values(p.departments || {}).reduce(
    (s, d) => s + (d.hrs || 0),
    0
  );
}

export function taskProgress(p: Project): { done: number; total: number; pct: number } {
  const phases = Object.values(p.phaseTasks || {});
  const customs = p.customTasks || [];
  const total = phases.length + customs.length;
  if (total === 0) return { done: 0, total: 0, pct: 0 };
  const done = phases.filter((t) => t.done).length + customs.filter((t) => t.done).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function createEmptyProject(): Project {
  const departments: Record<string, { pm: string; hrs: number | null }> = {};
  const phaseTasks: Record<string, { done: boolean; assignee: string; hrs: number | null; due: string; notes: string }> = {};
  for (const d of DEPARTMENTS) {
    departments[d] = { pm: "", hrs: null };
    phaseTasks[d] = { done: false, assignee: "", hrs: null, due: "", notes: "" };
  }
  return {
    id: Date.now().toString(),
    job: "",
    client: "",
    description: "",
    comments: "",
    status: "active",
    startDate: "",
    dueDate: "",
    departments,
    phaseTasks,
    customTasks: [],
  };
}
