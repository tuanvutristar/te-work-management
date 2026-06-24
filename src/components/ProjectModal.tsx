"use client";

import { useState } from "react";
import { Project, DEPARTMENTS, STATUS_CONFIG, StatusKey } from "@/lib/types";

interface Props {
  project: Project;
  isNew: boolean;
  onSave: (p: Project) => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function ProjectModal({ project, isNew, onSave, onClose, onDelete }: Props) {
  const [p, setP] = useState<Project>({ ...project });

  function setField<K extends keyof Project>(key: K, val: Project[K]) {
    setP((prev) => ({ ...prev, [key]: val }));
  }

  function setDept(dept: string, field: "pm" | "hrs", val: string | number | null) {
    setP((prev) => ({
      ...prev,
      departments: { ...prev.departments, [dept]: { ...prev.departments[dept], [field]: val } },
      phaseTasks: { ...prev.phaseTasks, [dept]: { ...prev.phaseTasks[dept], [field === "pm" ? "assignee" : "hrs"]: val } },
    }));
  }

  function handleSave() {
    if (!p.job.trim()) { alert("Job number is required"); return; }
    if (!p.client.trim()) { alert("Client is required"); return; }
    onSave(p);
  }

  const inputClass = "w-full py-2 px-3 bg-white border border-[#e5e7eb] rounded-xl text-[13px] text-[#111827] outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,.1)] transition-all placeholder:text-[#d1d5db]";
  const labelClass = "block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-backdrop" style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-[640px] max-h-[85vh] flex flex-col overflow-hidden animate-modal"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,.2), 0 4px 16px rgba(0,0,0,.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-5 px-6 border-b border-[#f3f4f6] shrink-0">
          <div>
            <div className="text-[18px] font-bold text-[#111827]">
              {isNew ? "New Project" : `Edit #${p.job}`}
            </div>
            <div className="text-[12px] text-[#9ca3af] mt-0.5">
              {isNew ? "Create a new project" : "Update project details"}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50 rounded-xl transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelClass}>Job Number <span className="text-red-400">*</span></label>
              <input className={inputClass} value={p.job} onChange={(e) => setField("job", e.target.value)} placeholder="e.g. 105000" />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={`${inputClass} cursor-pointer`} value={p.status} onChange={(e) => setField("status", e.target.value as StatusKey)}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelClass}>Client <span className="text-red-400">*</span></label>
              <input className={inputClass} value={p.client} onChange={(e) => setField("client", e.target.value)} placeholder="Client name" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input className={inputClass} value={p.description} onChange={(e) => setField("description", e.target.value)} placeholder="Project description" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" className={`${inputClass} cursor-pointer`} value={p.startDate || ""} onChange={(e) => setField("startDate", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" className={`${inputClass} cursor-pointer`} value={p.dueDate || ""} onChange={(e) => setField("dueDate", e.target.value)} />
            </div>
          </div>

          <div className="mb-5">
            <label className={labelClass}>Comments</label>
            <textarea className={`${inputClass} resize-y min-h-[60px]`} value={p.comments} onChange={(e) => setField("comments", e.target.value)} rows={2} placeholder="Notes..." />
          </div>

          {/* Department assignments */}
          <div>
            <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-3">Department Assignments</div>
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider py-2.5 px-4 text-left w-[120px]">Dept</th>
                    <th className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider py-2.5 px-3 text-left">PM / Assignee</th>
                    <th className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider py-2.5 px-3 text-left w-[90px]">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPARTMENTS.map((dept) => (
                    <tr key={dept} className="border-b border-[#f3f4f6] last:border-b-0 bg-white">
                      <td className="py-2 px-4 text-[12px] font-semibold text-[#374151]">{dept}</td>
                      <td className="py-2 px-3">
                        <input
                          className="w-full py-1.5 px-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg text-[12px] outline-none focus:border-[#3b82f6] focus:bg-white transition-all placeholder:text-[#d1d5db]"
                          value={p.departments[dept]?.pm || ""}
                          onChange={(e) => setDept(dept, "pm", e.target.value)}
                          placeholder="Initials"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          className="w-full py-1.5 px-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg text-[12px] outline-none focus:border-[#3b82f6] focus:bg-white transition-all placeholder:text-[#d1d5db] tabular-nums"
                          value={p.departments[dept]?.hrs ?? ""}
                          onChange={(e) => setDept(dept, "hrs", e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 py-4 px-6 border-t border-[#f3f4f6] shrink-0 bg-[#f9fafb]">
          {!isNew && (
            <button
              onClick={() => { if (confirm("Delete this project?")) onDelete(); }}
              className="py-2 px-4 text-[12px] font-bold text-[#ef4444] bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100 transition-all"
            >
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} className="py-2 px-5 text-[12px] font-bold text-[#6b7280] bg-white border border-[#e5e7eb] rounded-xl cursor-pointer hover:bg-[#f8fafc] hover:border-[#d1d5db] transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-6 text-[12px] font-bold text-white rounded-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", boxShadow: "0 2px 8px rgba(37,99,235,.25)" }}
          >
            {isNew ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
