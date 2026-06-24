import { Project } from "./types";

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "104388", job: "104388", client: "Agrisano Fresh", description: "Greenhouse 1 - LV Installation",
    comments: "", status: "inprogress", startDate: "", dueDate: "",
    departments: { Design: { pm: "", hrs: null }, Workshop: { pm: "", hrs: null }, PLC: { pm: "", hrs: null }, "SCADA/HMI": { pm: "", hrs: null }, Install: { pm: "LC", hrs: null }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "", hrs: null, due: "", notes: "" }, Workshop: { done: false, assignee: "", hrs: null, due: "", notes: "" }, PLC: { done: false, assignee: "", hrs: null, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: null, due: "", notes: "" }, Install: { done: false, assignee: "LC", hrs: null, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104652", job: "104652", client: "Agrisano", description: "Strawberry PDC, Nursery and PDC2.0",
    comments: "In progress", status: "done", startDate: "2026-06-04", dueDate: "2026-06-07",
    departments: { Design: { pm: "", hrs: null }, Workshop: { pm: "", hrs: null }, PLC: { pm: "", hrs: null }, "SCADA/HMI": { pm: "", hrs: null }, Install: { pm: "LM", hrs: null }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "", hrs: null, due: "", notes: "" }, Workshop: { done: false, assignee: "", hrs: null, due: "", notes: "" }, PLC: { done: false, assignee: "", hrs: null, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: null, due: "", notes: "" }, Install: { done: false, assignee: "LM", hrs: null, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104562", job: "104562", client: "City of Salisbury", description: "Bellchamber - New Electrical Controls",
    comments: "Panels tbc", status: "todo", startDate: "", dueDate: "",
    departments: { Design: { pm: "MS", hrs: 100 }, Workshop: { pm: "", hrs: 130 }, PLC: { pm: "AMM", hrs: 58 }, "SCADA/HMI": { pm: "CP", hrs: 90 }, Install: { pm: "FD", hrs: 815 }, Commission: { pm: "", hrs: 40 } },
    phaseTasks: { Design: { done: false, assignee: "MS", hrs: 100, due: "", notes: "", pct: 0 }, Workshop: { done: true, assignee: "", hrs: 130, due: "", notes: "Design is complete", pct: 100 }, PLC: { done: true, assignee: "AMM", hrs: 58, due: "", notes: "", pct: 100 }, "SCADA/HMI": { done: true, assignee: "CP", hrs: 90, due: "", notes: "", pct: 100 }, Install: { done: true, assignee: "FD", hrs: 815, due: "", notes: "", pct: 100 }, Commission: { done: false, assignee: "", hrs: 40, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104419", job: "104419", client: "Daronmont", description: "CEA Shelters",
    comments: "", status: "inprogress", startDate: "2026-06-29", dueDate: "2026-08-23",
    departments: { Design: { pm: "MS", hrs: 60 }, Workshop: { pm: "JL", hrs: 160 }, PLC: { pm: "", hrs: null }, "SCADA/HMI": { pm: "", hrs: null }, Install: { pm: "JB", hrs: 160 }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "MS", hrs: 60, due: "", notes: "" }, Workshop: { done: false, assignee: "JL", hrs: 160, due: "", notes: "" }, PLC: { done: false, assignee: "", hrs: null, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: null, due: "", notes: "" }, Install: { done: false, assignee: "JB", hrs: 160, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "105039", job: "105039", client: "Balco", description: "Ignition Project Split",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "", hrs: null }, Workshop: { pm: "", hrs: null }, PLC: { pm: "", hrs: null }, "SCADA/HMI": { pm: "PB / QT", hrs: 40 }, Install: { pm: "", hrs: null }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "", hrs: null, due: "", notes: "" }, Workshop: { done: false, assignee: "", hrs: null, due: "", notes: "" }, PLC: { done: true, assignee: "", hrs: null, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "PB / QT", hrs: 40, due: "", notes: "" }, Install: { done: false, assignee: "", hrs: null, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104904", job: "104904", client: "Bickfords", description: "New Line Installation",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "", hrs: null }, Workshop: { pm: "", hrs: null }, PLC: { pm: "RB", hrs: 160 }, "SCADA/HMI": { pm: "", hrs: null }, Install: { pm: "MR", hrs: 1704 }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "", hrs: null, due: "", notes: "" }, Workshop: { done: false, assignee: "", hrs: null, due: "", notes: "" }, PLC: { done: false, assignee: "RB", hrs: 160, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: null, due: "", notes: "" }, Install: { done: false, assignee: "MR", hrs: 1704, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "105000", job: "105000", client: "Bunge", description: "Pt Lincoln Elevator 654 & 655 Drive Upgrade",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "JL", hrs: 336 }, Workshop: { pm: "MH", hrs: 116 }, PLC: { pm: "", hrs: null }, "SCADA/HMI": { pm: "", hrs: null }, Install: { pm: "GT / LG", hrs: 2097 }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "JL", hrs: 336, due: "", notes: "" }, Workshop: { done: false, assignee: "MH", hrs: 116, due: "", notes: "" }, PLC: { done: false, assignee: "", hrs: null, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: null, due: "", notes: "" }, Install: { done: false, assignee: "GT / LG", hrs: 2097, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104974", job: "104974", client: "Cold Logic", description: "Loxton Venus Citrus Cold Store",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "SP", hrs: 44 }, Workshop: { pm: "MH", hrs: 118 }, PLC: { pm: "RB", hrs: 62 }, "SCADA/HMI": { pm: "AM", hrs: 44 }, Install: { pm: "FD", hrs: 622 }, Commission: { pm: "RB / MR", hrs: 50 } },
    phaseTasks: { Design: { done: true, assignee: "SP", hrs: 44, due: "", notes: "" }, Workshop: { done: false, assignee: "MH", hrs: 118, due: "", notes: "" }, PLC: { done: false, assignee: "RB", hrs: 62, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "AM", hrs: 44, due: "", notes: "" }, Install: { done: false, assignee: "FD", hrs: 622, due: "", notes: "" }, Commission: { done: false, assignee: "RB / MR", hrs: 50, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104968", job: "104968", client: "Ixom", description: "Osbourne - Alum Storage Tanks E&I Works",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "SP", hrs: 98 }, Workshop: { pm: "MH", hrs: 43 }, PLC: { pm: "CP", hrs: 48 }, "SCADA/HMI": { pm: "QT", hrs: 40 }, Install: { pm: "FD", hrs: 370 }, Commission: { pm: "CP", hrs: 64 } },
    phaseTasks: { Design: { done: false, assignee: "SP", hrs: 98, due: "", notes: "" }, Workshop: { done: false, assignee: "MH", hrs: 43, due: "", notes: "" }, PLC: { done: false, assignee: "CP", hrs: 48, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "QT", hrs: 40, due: "", notes: "" }, Install: { done: false, assignee: "FD", hrs: 370, due: "", notes: "" }, Commission: { done: false, assignee: "CP", hrs: 64, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104870", job: "104870", client: "JBS Townsville", description: "Coal Boiler PLC Replacement",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "JL", hrs: 91 }, Workshop: { pm: "MH", hrs: 97 }, PLC: { pm: "JH", hrs: 80 }, "SCADA/HMI": { pm: "", hrs: 64 }, Install: { pm: "DS", hrs: 183 }, Commission: { pm: "JH", hrs: 64 } },
    phaseTasks: { Design: { done: false, assignee: "JL", hrs: 91, due: "", notes: "" }, Workshop: { done: false, assignee: "MH", hrs: 97, due: "", notes: "" }, PLC: { done: false, assignee: "JH", hrs: 80, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: 64, due: "", notes: "" }, Install: { done: false, assignee: "DS", hrs: 183, due: "", notes: "" }, Commission: { done: false, assignee: "JH", hrs: 64, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "103219", job: "103219", client: "Cold Logic", description: "Wingfield Test Facility",
    comments: "Waiting on Client", status: "inprogress", startDate: "2026-06-18", dueDate: "2026-07-12",
    departments: { Design: { pm: "CB", hrs: 25 }, Workshop: { pm: "JL", hrs: 47 }, PLC: { pm: "MS", hrs: 25 }, "SCADA/HMI": { pm: "HN/QT", hrs: 25 }, Install: { pm: "DS", hrs: 347 }, Commission: { pm: "MS", hrs: 50 } },
    phaseTasks: { Design: { done: true, assignee: "CB", hrs: 25, due: "", notes: "", pct: 100 }, Workshop: { done: true, assignee: "JL", hrs: 47, due: "", notes: "", pct: 100 }, PLC: { done: true, assignee: "MS", hrs: 25, due: "", notes: "", pct: 100 }, "SCADA/HMI": { done: true, assignee: "HN/QT", hrs: 25, due: "", notes: "", pct: 100 }, Install: { done: false, assignee: "DS", hrs: 347, due: "", notes: "", pct: 0 }, Commission: { done: false, assignee: "MS", hrs: 50, due: "", notes: "", pct: 0 } },
    customTasks: []
  },
  {
    id: "104808", job: "104808", client: "McCain Foods", description: "Ballarat - HP Condensate Project",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "", hrs: 41 }, Workshop: { pm: "MH", hrs: 76 }, PLC: { pm: "CP", hrs: 62 }, "SCADA/HMI": { pm: "CP", hrs: 90 }, Install: { pm: "GT", hrs: 325 }, Commission: { pm: "HW", hrs: 80 } },
    phaseTasks: { Design: { done: false, assignee: "", hrs: 41, due: "", notes: "" }, Workshop: { done: false, assignee: "MH", hrs: 76, due: "", notes: "" }, PLC: { done: false, assignee: "CP", hrs: 62, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "CP", hrs: 90, due: "", notes: "" }, Install: { done: false, assignee: "GT", hrs: 325, due: "", notes: "" }, Commission: { done: false, assignee: "HW", hrs: 80, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104676", job: "104676", client: "TWE", description: "Biogas PLC Replacement",
    comments: "", status: "active", startDate: "", dueDate: "",
    departments: { Design: { pm: "SP", hrs: 80 }, Workshop: { pm: "", hrs: null }, PLC: { pm: "AM", hrs: 80 }, "SCADA/HMI": { pm: "BN", hrs: 40 }, Install: { pm: "FD", hrs: 56 }, Commission: { pm: "PB/AM", hrs: 40 } },
    phaseTasks: { Design: { done: false, assignee: "SP", hrs: 80, due: "", notes: "" }, Workshop: { done: false, assignee: "", hrs: null, due: "", notes: "" }, PLC: { done: false, assignee: "AM", hrs: 80, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "BN", hrs: 40, due: "", notes: "" }, Install: { done: false, assignee: "FD", hrs: 56, due: "", notes: "" }, Commission: { done: false, assignee: "PB/AM", hrs: 40, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104977", job: "104977", client: "Vinarchy", description: "RF - Warehouse 2 Tank Controls",
    comments: "", status: "todo", startDate: "", dueDate: "",
    departments: { Design: { pm: "JL", hrs: 36 }, Workshop: { pm: "", hrs: null }, PLC: { pm: "HW", hrs: 72 }, "SCADA/HMI": { pm: "AM", hrs: 60 }, Install: { pm: "LM", hrs: 174 }, Commission: { pm: "HW", hrs: 48 } },
    phaseTasks: { Design: { done: false, assignee: "JL", hrs: 36, due: "", notes: "" }, Workshop: { done: false, assignee: "", hrs: null, due: "", notes: "" }, PLC: { done: false, assignee: "HW", hrs: 72, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "AM", hrs: 60, due: "", notes: "" }, Install: { done: false, assignee: "LM", hrs: 174, due: "", notes: "" }, Commission: { done: false, assignee: "HW", hrs: 48, due: "", notes: "" } },
    customTasks: []
  },
  {
    id: "104792", job: "104792", client: "Bluescope", description: "C-Dek Machine Electrical Cabinet",
    comments: "", status: "inprogress", startDate: "", dueDate: "",
    departments: { Design: { pm: "SP", hrs: 24 }, Workshop: { pm: "MH", hrs: 68 }, PLC: { pm: "", hrs: null }, "SCADA/HMI": { pm: "", hrs: null }, Install: { pm: "BC", hrs: 50 }, Commission: { pm: "", hrs: null } },
    phaseTasks: { Design: { done: false, assignee: "SP", hrs: 24, due: "", notes: "" }, Workshop: { done: false, assignee: "MH", hrs: 68, due: "", notes: "" }, PLC: { done: false, assignee: "", hrs: null, due: "", notes: "" }, "SCADA/HMI": { done: false, assignee: "", hrs: null, due: "", notes: "" }, Install: { done: false, assignee: "BC", hrs: 50, due: "", notes: "" }, Commission: { done: false, assignee: "", hrs: null, due: "", notes: "" } },
    customTasks: []
  },
];
