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
  function getName(code: string) { return code ? (contactMap.get(code.trim()) || code) : ""; }

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
    onUpdate({ ...p, customTasks: [...p.customTasks, { name, done: false, assignee: "", due: "", notes: "" }] });
  }

  function deleteCustomTask(i: number) {
    onUpdate({ ...p, customTasks: p.customTasks.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="w-[380px] bg-white border-l border-[#e5e7eb] flex flex-col shrink-0 overflow-hidden animate-slide-right" style={{ boxShadow: "-8px 0 30px rgba(0,0,0,.04)" }}>
      {/* Panel header */}
      <div className="shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ background: `linear-gradient(135deg, ${cfg?.color} 0%, transparent 60%)` }} />
        <div className="flex items-start gap-3 py-4 px-5 relative">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-[#94a3b8] bg-[#f1f5f9] px-1.5 py-0.5 rounded">#{p.job}</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold py-[2px] px-2 rounded-full border" style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
                <span className="w-[4px] h-[4px] rounded-full" style={{ background: cfg?.color }} />
                {cfg?.label}
              </span>
            </div>
            <div className="text-[15px] font-bold text-[#111827] leading-snug">{p.client}</div>
            <div className="text-[12px] text-[#6b7280] mt-0.5 leading-relaxed">{p.description}</div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} className="p-1.5 text-[#9ca3af] hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-all" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
            <button onClick={onClose} className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent" />
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hrs > 0 && (
            <span className="text-[11px] font-semibold text-[#6b7280] bg-[#f1f5f9] px-2.5 py-1 rounded-lg flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              {hrs.toLocaleString()} hrs
            </span>
          )}
          {p.startDate && <span className="text-[11px] font-semibold text-[#6b7280] bg-[#f1f5f9] px-2.5 py-1 rounded-lg">Start: {p.startDate}</span>}
          {p.dueDate && <span className="text-[11px] font-semibold text-[#6b7280] bg-[#f1f5f9] px-2.5 py-1 rounded-lg">Due: {p.dueDate}</span>}
        </div>

        {p.comments && (
          <div className="mb-4 text-[12px] text-[#6b7280] bg-[#f8fafc] border border-[#f1f5f9] p-3 rounded-xl leading-relaxed italic">{p.comments}</div>
        )}

        {/* Progress */}
        <div className="mb-5 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Overall Progress</span>
            <span className={`text-[14px] font-extrabold tabular-nums ${prog.pct === 100 ? "text-emerald-600" : "text-[#111827]"}`}>{prog.pct}%</span>
          </div>
          <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${prog.pct === 100 ? "bg-emerald-500" : ""}`}
              style={{ width: `${prog.pct}%`, ...( prog.pct < 100 ? { background: "linear-gradient(90deg, #3b82f6, #6366f1)" } : {}) }}
            />
          </div>
          <div className="text-[10px] text-[#9ca3af] mt-1.5 font-medium">{prog.done} of {prog.total} phases complete</div>
        </div>

        {/* Phase tasks */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-3">Department Phases</div>
          <div className="space-y-1">
            {DEPARTMENTS.map((dept) => {
              const phase = p.phaseTasks?.[dept];
              const d = p.departments[dept];
              if (!phase && !d) return null;
              const done = phase?.done || false;
              const assignee = phase?.assignee || d?.pm || "";
              const hours = phase?.hrs ?? d?.hrs;
              return (
                <div
                  key={dept}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors cursor-pointer -mx-1 ${
                    done ? "bg-emerald-50/50 hover:bg-emerald-50" : "hover:bg-[#f8fafc]"
                  }`}
                  onClick={() => togglePhase(dept)}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    done ? "bg-emerald-500 border-emerald-500" : "border-[#d1d5db] hover:border-[#3b82f6]"
                  }`}>
                    {done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[12px] font-semibold ${done ? "text-emerald-700 line-through" : "text-[#111827]"}`}>{dept}</span>
                    {assignee && <span className="text-[10px] text-[#9ca3af] ml-1.5">— {getName(assignee)}</span>}
                  </div>
                  <span className="text-[11px] text-[#9ca3af] font-medium tabular-nums shrink-0">{hours ? `${hours}h` : ""}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom tasks */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Custom Tasks</span>
            <button onClick={addCustomTask} className="text-[11px] font-bold text-[#3b82f6] hover:text-[#1d4ed8] cursor-pointer flex items-center gap-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add
            </button>
          </div>
          {p.customTasks.length === 0 ? (
            <div className="text-[11px] text-[#d1d5db] text-center py-4 bg-[#f8fafc] rounded-xl border border-dashed border-[#e5e7eb]">No custom tasks yet</div>
          ) : (
            <div className="space-y-1">
              {p.customTasks.map((task, i) => (
                <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors -mx-1 ${task.done ? "bg-emerald-50/50" : "hover:bg-[#f8fafc]"}`}>
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      task.done ? "bg-emerald-500 border-emerald-500" : "border-[#d1d5db] hover:border-[#3b82f6]"
                    }`}
                    onClick={() => toggleCustom(i)}
                  >
                    {task.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                  </div>
                  <span className={`flex-1 text-[12px] ${task.done ? "text-emerald-700 line-through" : "text-[#111827]"}`}>{task.name}</span>
                  <button onClick={() => deleteCustomTask(i)} className="text-[#d1d5db] hover:text-[#ef4444] text-sm shrink-0 transition-colors">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel footer */}
      <div className="shrink-0 border-t border-[#e5e7eb] bg-[#f9fafb]">
        <div className="flex gap-2 p-4">
          <button
            onClick={onEdit}
            className="flex-1 py-2 text-[12px] font-bold text-white rounded-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", boxShadow: "0 2px 8px rgba(37,99,235,.25)" }}
          >
            Edit Project
          </button>
          <button
            onClick={() => { if (confirm("Delete this project?")) onDelete(); }}
            className="py-2 px-3.5 text-[12px] font-bold text-[#ef4444] bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
