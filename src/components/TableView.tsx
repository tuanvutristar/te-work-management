"use client";

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
    <span
      className="inline-flex items-center text-[10px] py-[3px] px-2.5 rounded-full font-bold border whitespace-nowrap gap-1"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function SortHeader({ col, label, sortCol, sortDir, onSort, className }: { col: string; label: string; sortCol: string; sortDir: string; onSort: (c: string) => void; className?: string }) {
  const active = sortCol === col;
  return (
    <th
      className={`text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider py-3 px-4 text-left cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[#111827] group ${className || ""}`}
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`}>
          {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </span>
    </th>
  );
}

export default function TableView({ projects, selectedId, onSelect, sortCol, sortDir, onSort }: Props) {
  return (
    <div className="absolute inset-0 overflow-y-auto p-5 animate-fade-in">
      <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 24px rgba(0,0,0,.06)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <SortHeader col="job" label="Job #" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="client" label="Client" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="description" label="Description" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="status" label="Status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="hrs" label="Hours" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="progress" label="Progress" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <th className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider py-3 px-4 text-left">Depts</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const hrs = totalHrs(p);
              const prog = taskProgress(p);
              const isSelected = selectedId === p.id;
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`border-b border-[#f3f4f6] cursor-pointer transition-all duration-150 last:border-b-0 group ${
                    isSelected
                      ? "bg-blue-50/80 shadow-[inset_3px_0_0_#3b82f6]"
                      : i % 2 === 0
                      ? "bg-white hover:bg-[#f8fafc]"
                      : "bg-[#fafbfc] hover:bg-[#f1f5f9]"
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-mono font-bold text-[#94a3b8] bg-[#f1f5f9] px-1.5 py-0.5 rounded">{p.job}</span>
                  </td>
                  <td className="py-3 px-4 text-[13px] font-semibold text-[#111827] group-hover:text-[#2563eb] transition-colors">{p.client}</td>
                  <td className="py-3 px-4 text-[13px] text-[#6b7280] max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis">{p.description}</td>
                  <td className="py-3 px-4"><StatusPill status={p.status} /></td>
                  <td className="py-3 px-4 text-[13px] text-[#6b7280] font-medium tabular-nums">{hrs > 0 ? hrs.toLocaleString() : <span className="text-[#d1d5db]">—</span>}</td>
                  <td className="py-3 px-4 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[5px] bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${prog.pct === 100 ? "bg-emerald-500" : ""}`}
                          style={{ width: `${prog.pct}%`, ...( prog.pct < 100 ? { background: "linear-gradient(90deg, #3b82f6, #6366f1)" } : {}) }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold tabular-nums min-w-[28px] text-right ${prog.pct === 100 ? "text-emerald-600" : "text-[#94a3b8]"}`}>{prog.pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-[3px]">
                      {DEPARTMENTS.map((d) => {
                        const dept = p.departments[d];
                        const phase = p.phaseTasks?.[d];
                        if (!dept || (!dept.pm && !dept.hrs)) return null;
                        return (
                          <span
                            key={d}
                            className={`text-[8px] font-bold px-1.5 py-[2px] rounded ${
                              phase?.done
                                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                                : "bg-[#f1f5f9] text-[#94a3b8]"
                            }`}
                            title={`${d}: ${dept.pm || "Unassigned"} — ${dept.hrs || 0}h`}
                          >
                            {d === "SCADA/HMI" ? "SCA" : d.substring(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="text-[#d1d5db] text-sm font-medium">No projects found</div>
                  <div className="text-[#e5e7eb] text-xs mt-1">Try adjusting your filters</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
