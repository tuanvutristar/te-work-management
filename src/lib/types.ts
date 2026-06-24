export interface DepartmentInfo {
  pm: string;
  hrs: number | null;
}

export interface PhaseTask {
  done: boolean;
  assignee: string;
  hrs: number | null;
  due: string;
  notes: string;
  pct?: number;
}

export interface CustomTask {
  name: string;
  done: boolean;
  assignee: string;
  due: string;
  notes: string;
  pct?: number;
}

export interface Project {
  id: string;
  job: string;
  client: string;
  description: string;
  comments: string;
  status: "todo" | "active" | "inprogress" | "done";
  startDate?: string;
  dueDate?: string;
  departments: Record<string, DepartmentInfo>;
  phaseTasks: Record<string, PhaseTask>;
  customTasks: CustomTask[];
}

export interface Contact {
  id: string;
  name: string;
}

export const DEPARTMENTS = [
  "Design",
  "Workshop",
  "PLC",
  "SCADA/HMI",
  "Install",
  "Commission",
] as const;

export const STATUS_CONFIG = {
  todo: { label: "To Do", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  active: { label: "Active", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  inprogress: { label: "In Progress", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  done: { label: "Done", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;
export type TabName = "table" | "board" | "summary" | "gantt" | "people";
