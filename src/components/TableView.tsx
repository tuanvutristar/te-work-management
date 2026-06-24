"use client";

import { Project, Contact, STATUS_CONFIG, DEPARTMENTS } from "@/lib/types";
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
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center text-[10px] py-[2px] px-2 rounded-full font-bold border whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}

function SortHeader({ col, label, sortCol, sortDir, onSort, className }: { col: string; label: string; sortCol: string; sortDir: string; onSort: (c: string) => void; className?: string }) {
  return (
    <th
      className={`text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2.5 px-3.5 text-left cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[#1a1e2e] ${className || ""}`}
      onClick={() => onSort(col)}
    >
      {label} {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}

export default function TableView({ projects, selectedId, onSelect, sortCol, sortDir, onSort }: Props) {
  return (
    <div className="absolute inset-0 overflow-y-auto p-4 px-5">
      <div className="bg-white border border-[#e0e4ec] rounded-xl shadow-[0_4px_20px_rgba(26,30,46,.11),0_2px_6px_rgba(26,30,46,.05)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f6f7fa] border-b border-[#e0e4ec]">
              <SortHeader col="job" label="Job #" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="client" label="Client" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="description" label="Description" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="status" label="Status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="hrs" label="Hours" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <SortHeader col="progress" label="Progress" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
              <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2.5 px-3.5 text-left">Departments</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const hrs = totalHrs(p);
              const prog = taskProgress(p);
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`border-b border-[#e0e4ec] cursor-pointer transition-colors last:border-b-0 ${
                    selectedId === p.id
                      ? "bg-[#eff6ff] shadow-[inset_3px_0_0_#2563eb]"
                      : i % 2 === 1
                      ? "bg-[rgba(240,244,248,.55)] hover:bg-[#eff6ff]"
                      : "hover:bg-[#eff6ff]"
                  }`}
                >
                  <td className="py-2.5 px-3.5 text-[12px] font-bold text-[#9aa0b8] whitespace-nowrap">{p.job}</td>
                  <td className="py-2.5 px-3.5 text-[13px] font-bold text-[#1a1e2e]">{p.client}</td>
                  <td className="py-2.5 px-3.5 text-[13px] text-[#5a6278] max-w-[260px] whitespace-nowrap overflow-hidden text-ellipsis">{p.description}</td>
                  <td className="py-2.5 px-3.5"><StatusPill status={p.status} /></td>
                  <td className="py-2.5 px-3.5 text-[13px] text-[#5a6278] font-semibold">{hrs > 0 ? hrs.toLocaleString() : "—"}</td>
                  <td className="py-2.5 px-3.5">
                    <div className="text-[10px] text-[#9aa0b8] font-bold mb-1">{prog.pct}%</div>
                    <div className="h-1.5 bg-[#eceef3] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-400"
                        style={{ width: `${prog.pct}%`, background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex gap-1">
                      {DEPARTMENTS.map((d) => {
                        const dept = p.departments[d];
                        const phase = p.phaseTasks?.[d];
                        if (!dept || (!dept.pm && !dept.hrs)) return null;
                        return (
                          <span
                            key={d}
                            className={`text-[9px] font-bold px-1.5 py-[1px] rounded-sm ${
                              phase?.done
                                ? "bg-[#f0fdf4] text-[#16a34a]"
                                : "bg-[#f6f7fa] text-[#9aa0b8]"
                            }`}
                            title={`${d}: ${dept.pm || "Unassigned"} — ${dept.hrs || 0}h`}
                          >
                            {d.split("/")[0].substring(0, 3)}
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
                <td colSpan={7} className="py-12 text-center text-[#9aa0b8] text-sm">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
