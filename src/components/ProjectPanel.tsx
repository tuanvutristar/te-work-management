"use client";

import { Project, Contact, DEPARTMENTS, STATUS_CONFIG, StatusKey } from "@/lib/types";
import { totalHrs, taskProgress } from "@/lib/store";

interface Props {
  project: Project;
  contacts: Contact[];
  onClose: () => void;
  onUpdate: (p: Project) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectPanel({ project: p, contacts, onClose, onUpdate, onEdit, onDelete }: Props) {
  const hrs = totalHrs(p);
  const prog = taskProgress(p);
  const cfg = STATUS_CONFIG[p.status as StatusKey];

  const contactMap = new Map<string, string>();
  for (const c of contacts) contactMap.set(c.id, c.name);

  function getName(code: string) {
    if (!code) return "";
    return contactMap.get(code.trim()) || code;
  }

  function togglePhase(dept: string) {
    const updated = { ...p, phaseTasks: { ...p.phaseTasks } };
    const phase = { ...updated.phaseTasks[dept] };
    phase.done = !phase.done;
    if (phase.done) phase.pct = 100;
    updated.phaseTasks[dept] = phase;
    onUpdate(updated);
  }

  function toggleCustom(i: number) {
    const updated = { ...p, customTasks: [...p.customTasks] };
    updated.customTasks[i] = { ...updated.customTasks[i], done: !updated.customTasks[i].done };
    onUpdate(updated);
  }

  function addCustomTask() {
    const name = prompt("Task name:");
    if (!name) return;
    const updated = {
      ...p,
      customTasks: [...p.customTasks, { name, done: false, assignee: "", due: "", notes: "" }],
    };
    onUpdate(updated);
  }

  function deleteCustomTask(i: number) {
    const updated = { ...p, customTasks: p.customTasks.filter((_, idx) => idx !== i) };
    onUpdate(updated);
  }

  return (
    <div className="w-[380px] bg-white border-l border-[#e0e4ec] flex flex-col shrink-0 overflow-hidden shadow-[-4px_0_20px_rgba(26,30,46,.06)]">
      {/* Panel header */}
      <div className="flex items-center gap-2 py-3 px-4 border-b border-[#e0e4ec] shrink-0 bg-[#f6f7fa]">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-[#9aa0b8]">#{p.job}</div>
          <div className="text-[14px] font-bold text-[#1a1e2e] truncate">{p.client}</div>
        </div>
        <button
          onClick={onEdit}
          className="p-1.5 text-[#9aa0b8] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-md transition-colors"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-[#9aa0b8] hover:text-[#dc2626] hover:bg-[#fff1f2] rounded-md transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Description & status */}
        <div className="mb-4">
          <div className="text-[13px] text-[#5a6278] mb-2">{p.description}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold py-[2px] px-2 rounded-full border" style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
              {cfg?.label}
            </span>
            {hrs > 0 && <span className="text-[11px] text-[#9aa0b8] font-semibold">{hrs.toLocaleString()} hrs</span>}
            {p.startDate && <span className="text-[11px] text-[#9aa0b8]">Start: {p.startDate}</span>}
            {p.dueDate && <span className="text-[11px] text-[#9aa0b8]">Due: {p.dueDate}</span>}
          </div>
          {p.comments && (
            <div className="mt-2 text-[12px] text-[#5a6278] italic bg-[#f6f7fa] p-2 rounded-lg">{p.comments}</div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider">Progress</span>
            <span className="text-[12px] font-bold text-[#1a1e2e]">{prog.pct}%</span>
          </div>
          <div className="h-2 bg-[#eceef3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${prog.pct}%`, background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
            />
          </div>
          <div className="text-[11px] text-[#9aa0b8] mt-1">{prog.done} of {prog.total} phases complete</div>
        </div>

        {/* Phase tasks */}
        <div className="mb-4">
          <div className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-2">Department Phases</div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#e0e4ec]">
                <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1 pr-3 text-left w-[130px]">Phase</th>
                <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1 pr-3 text-left">Assignee</th>
                <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1 text-left w-[60px]">Hours</th>
                <th className="w-[30px]"></th>
              </tr>
            </thead>
            <tbody>
              {DEPARTMENTS.map((dept) => {
                const phase = p.phaseTasks?.[dept];
                const d = p.departments[dept];
                if (!phase && !d) return null;
                const done = phase?.done || false;
                const assignee = phase?.assignee || d?.pm || "";
                const hours = phase?.hrs ?? d?.hrs;
                return (
                  <tr key={dept} className="border-b border-[#e0e4ec] last:border-b-0">
                    <td className="py-1.5 pr-3">
                      <span className={`text-[12px] font-semibold ${done ? "text-[#16a34a] line-through" : "text-[#1a1e2e]"}`}>
                        {dept}
                      </span>
                    </td>
                    <td className="py-1.5 pr-3 text-[12px] text-[#5a6278]">{getName(assignee)}</td>
                    <td className="py-1.5 text-[12px] text-[#9aa0b8] font-semibold">{hours || "—"}</td>
                    <td className="py-1.5">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => togglePhase(dept)}
                        className="w-4 h-4 accent-[#16a34a] cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Custom tasks */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider">Custom Tasks</span>
            <button
              onClick={addCustomTask}
              className="text-[11px] font-bold text-[#2563eb] hover:text-[#1d4ed8] cursor-pointer"
            >
              + Add
            </button>
          </div>
          {p.customTasks.length === 0 ? (
            <div className="text-[12px] text-[#9aa0b8] text-center py-3">No custom tasks</div>
          ) : (
            p.customTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#e0e4ec] last:border-b-0">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleCustom(i)}
                  className="w-4 h-4 accent-[#16a34a] cursor-pointer shrink-0"
                />
                <span className={`flex-1 text-[12px] ${task.done ? "text-[#16a34a] line-through" : "text-[#1a1e2e]"}`}>
                  {task.name}
                </span>
                <button
                  onClick={() => deleteCustomTask(i)}
                  className="text-[#9aa0b8] hover:text-[#dc2626] text-[11px] shrink-0"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[#e0e4ec]">
          <button
            onClick={onEdit}
            className="flex-1 py-2 text-[12px] font-bold text-white rounded-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
          >
            Edit Project
          </button>
          <button
            onClick={() => { if (confirm("Delete this project?")) onDelete(); }}
            className="py-2 px-3 text-[12px] font-bold text-[#dc2626] bg-[#fff1f2] border border-[#fecaca] rounded-lg cursor-pointer hover:bg-[#fecaca] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
