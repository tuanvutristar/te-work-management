"use client";

import { useState } from "react";
import { Project, Contact, STATUS_CONFIG, DEPARTMENTS, StatusKey } from "@/lib/types";
import { totalHrs, taskProgress } from "@/lib/store";

interface Props {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  sortCol: string;
  sortDir: "asc" | "desc";
  onSort: (col: string) => void;
  contacts: Contact[];
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as StatusKey];
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center text-[11px] py-[2px] px-2.5 rounded font-bold whitespace-nowrap" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
}

function SortHeader({ col, label, sortCol, sortDir, onSort }: { col: string; label: string; sortCol: string; sortDir: string; onSort: (c: string) => void }) {
  const active = sortCol === col;
  return (
    <th
      className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider py-2.5 px-3 text-left cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[#1a1e2e]"
      onClick={() => onSort(col)}
    >
      {label}{active ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}

export default function TableView({ projects, selectedId, onSelect, sortCol, sortDir, onSort }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 px-5">
      <div className="bg-white border border-[#dde1ea] rounded-xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f4f6fa] border-b border-[#dde1ea]">
              <th className="w-8"></th>
              <SortHeader col="job" label="Job #" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="client" label="Client" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="description" label="Description" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="status" label="Status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="progress" label="Progress" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="hrs" label="Est. Hrs" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <th className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider py-2.5 px-3 text-left cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("due")}>
                Due{sortCol === "due" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const hrs = totalHrs(p);
              const prog = taskProgress(p);
              const isSelected = selectedId === p.id;
              const isExpanded = expanded.has(p.id);
              const isOverdue = p.dueDate && new Date(p.dueDate) < new Date() && p.status !== "done";

              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`border-b border-[#eef0f4] cursor-pointer transition-colors last:border-b-0 ${
                    isSelected ? "bg-[#e8f0fe]" : i % 2 === 1 ? "bg-[#f8f9fc]" : "bg-white"
                  } hover:bg-[#edf2ff]`}
                >
                  <td className="py-2.5 px-1 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpanded((s) => { const n = new Set(s); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; }); }}
                      className="text-[#2563eb]/60 hover:text-[#2563eb] transition-colors text-[10px] w-6 h-6 flex items-center justify-center"
                    >
                      {isExpanded ? "▼" : "▶"}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-[13px] font-bold text-[#6b7a96] whitespace-nowrap">{p.job}</td>
                  <td className="py-2.5 px-3 text-[13px] font-bold text-[#1a1e2e]">{p.client}</td>
                  <td className="py-2.5 px-3 text-[13px] text-[#5a6278] max-w-[260px] whitespace-nowrap overflow-hidden text-ellipsis">{p.description}</td>
                  <td className="py-2.5 px-3"><StatusPill status={p.status} /></td>
                  <td className="py-2.5 px-3 min-w-[90px]">
                    <div className="text-[12px] font-bold text-[#6b7a96] mb-1">{prog.pct}%</div>
                    <div className="h-[4px] bg-[#e8eaf0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-400"
                        style={{
                          width: `${prog.pct}%`,
                          background: prog.pct === 100 ? "#16a34a" : "#2563eb"
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[13px] text-[#1a1e2e] font-bold text-center tabular-nums">
                    {hrs > 0 ? hrs.toLocaleString() : <span className="text-[#c0c5d0]">—</span>}
                  </td>
                  <td className="py-2.5 px-3">
                    {p.dueDate ? (
                      <span className={`text-[11px] font-bold py-[2px] px-2 rounded ${
                        p.status === "done"
                          ? "bg-[#e8f8ef] text-[#16a34a]"
                          : isOverdue
                          ? "bg-[#fef2f2] text-[#dc2626]"
                          : "bg-[#fff8eb] text-[#d97706]"
                      }`}>
                        {new Date(p.dueDate).toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                      </span>
                    ) : (
                      <span className="text-[#c0c5d0] text-[13px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr><td colSpan={8} className="py-16 text-center text-[#9ca3af] text-sm">No projects found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
