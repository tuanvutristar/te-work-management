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
      departments: {
        ...prev.departments,
        [dept]: { ...prev.departments[dept], [field]: val },
      },
      phaseTasks: {
        ...prev.phaseTasks,
        [dept]: {
          ...prev.phaseTasks[dept],
          [field === "pm" ? "assignee" : "hrs"]: val,
        },
      },
    }));
  }

  function handleSave() {
    if (!p.job.trim()) { alert("Job number is required"); return; }
    if (!p.client.trim()) { alert("Client is required"); return; }
    onSave(p);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-[0_14px_44px_rgba(26,30,46,.18)] w-[620px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-5 border-b border-[#e0e4ec] shrink-0">
          <div>
            <div className="text-[16px] font-bold text-[#1a1e2e]">
              {isNew ? "New Project" : `Edit Project #${p.job}`}
            </div>
            <div className="text-[12px] text-[#9aa0b8]">
              {isNew ? "Create a new project" : "Update project details"}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9aa0b8] hover:text-[#dc2626] rounded-lg transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Job Number *</label>
              <input
                className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,.13)]"
                value={p.job}
                onChange={(e) => setField("job", e.target.value)}
                placeholder="e.g. 105000"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Status</label>
              <select
                className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none cursor-pointer focus:border-[#2563eb]"
                value={p.status}
                onChange={(e) => setField("status", e.target.value as StatusKey)}
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Client *</label>
              <input
                className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,.13)]"
                value={p.client}
                onChange={(e) => setField("client", e.target.value)}
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Description</label>
              <input
                className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,.13)]"
                value={p.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Project description"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="date"
                className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none cursor-pointer focus:border-[#2563eb]"
                value={p.startDate || ""}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Due Date</label>
              <input
                type="date"
                className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none cursor-pointer focus:border-[#2563eb]"
                value={p.dueDate || ""}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1">Comments</label>
            <textarea
              className="w-full py-2 px-3 bg-white border border-[#e0e4ec] rounded-lg text-[13px] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,.13)] resize-y min-h-[60px]"
              value={p.comments}
              onChange={(e) => setField("comments", e.target.value)}
              rows={2}
              placeholder="Notes or comments..."
            />
          </div>

          {/* Department assignments */}
          <div>
            <div className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-2">Department Assignments</div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#e0e4ec]">
                  <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1.5 pr-2 text-left w-[120px]">Dept</th>
                  <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1.5 pr-2 text-left">PM / Assignee</th>
                  <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1.5 text-left w-[80px]">Hours</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => (
                  <tr key={dept} className="border-b border-[#e0e4ec] last:border-b-0">
                    <td className="py-1.5 pr-2 text-[12px] font-semibold text-[#1a1e2e]">{dept}</td>
                    <td className="py-1.5 pr-2">
                      <input
                        className="w-full py-1 px-2 bg-[#f6f7fa] border border-[#e0e4ec] rounded text-[12px] outline-none focus:border-[#2563eb]"
                        value={p.departments[dept]?.pm || ""}
                        onChange={(e) => setDept(dept, "pm", e.target.value)}
                        placeholder="Initials"
                      />
                    </td>
                    <td className="py-1.5">
                      <input
                        type="number"
                        className="w-full py-1 px-2 bg-[#f6f7fa] border border-[#e0e4ec] rounded text-[12px] outline-none focus:border-[#2563eb]"
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

        {/* Footer */}
        <div className="flex items-center gap-2 py-3.5 px-5 border-t border-[#e0e4ec] shrink-0 bg-[#f6f7fa]">
          {!isNew && (
            <button
              onClick={() => { if (confirm("Delete this project?")) onDelete(); }}
              className="py-2 px-3 text-[12px] font-bold text-[#dc2626] bg-[#fff1f2] border border-[#fecaca] rounded-lg cursor-pointer hover:bg-[#fecaca] transition-colors"
            >
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="py-2 px-4 text-[12px] font-bold text-[#5a6278] bg-white border border-[#e0e4ec] rounded-lg cursor-pointer hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-5 text-[12px] font-bold text-white rounded-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
          >
            {isNew ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
