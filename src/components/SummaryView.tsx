"use client";

import { Project, STATUS_CONFIG, StatusKey, DEPARTMENTS } from "@/lib/types";
import { totalHrs, taskProgress } from "@/lib/store";

interface Props {
  projects: Project[];
  filtered: Project[];
  onSelect: (id: string) => void;
}

export default function SummaryView({ projects, filtered, onSelect }: Props) {
  const all = projects;
  const statusCounts = {
    todo: all.filter((p) => p.status === "todo").length,
    active: all.filter((p) => p.status === "active").length,
    inprogress: all.filter((p) => p.status === "inprogress").length,
    done: all.filter((p) => p.status === "done").length,
  };
  const total = all.length;
  const totalHours = all.reduce((s, p) => s + totalHrs(p), 0);

  const clientMap = new Map<string, { total: number; statuses: Record<string, number> }>();
  for (const p of all) {
    if (!clientMap.has(p.client)) clientMap.set(p.client, { total: 0, statuses: {} });
    const entry = clientMap.get(p.client)!;
    entry.total++;
    entry.statuses[p.status] = (entry.statuses[p.status] || 0) + 1;
  }
  const topClients = Array.from(clientMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  const deptHours: Record<string, number> = {};
  for (const d of DEPARTMENTS) deptHours[d] = 0;
  for (const p of all) {
    for (const [d, info] of Object.entries(p.departments)) {
      deptHours[d] = (deptHours[d] || 0) + (info.hrs || 0);
    }
  }
  const maxDeptHrs = Math.max(...Object.values(deptHours), 1);

  const overdue = all.filter((p) => {
    if (p.status === "done" || !p.dueDate) return false;
    return new Date(p.dueDate) < new Date();
  });

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 px-5">
      {/* Metrics cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5 mb-3.5">
        {[
          { label: "Total Projects", val: total, color: "#2563eb" },
          { label: "To Do", val: statusCounts.todo, color: "#0ea5e9" },
          { label: "Active", val: statusCounts.active, color: "#7c3aed" },
          { label: "In Progress", val: statusCounts.inprogress, color: "#d97706" },
          { label: "Done", val: statusCounts.done, color: "#16a34a" },
          { label: "Total Hours", val: totalHours.toLocaleString(), color: "#1a1e2e", sub: "Allocated" },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white border border-[#e0e4ec] rounded-xl py-3 px-3.5 shadow-[0_1px_3px_rgba(26,30,46,.07)] transition-all hover:shadow-[0_4px_20px_rgba(26,30,46,.11)] hover:-translate-y-px"
            style={{ borderTopWidth: 3, borderTopColor: m.color }}
          >
            <div className="text-[9px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-1.5">{m.label}</div>
            <div className="text-[22px] font-extrabold tracking-tight leading-none" style={{ color: m.color }}>{m.val}</div>
            {m.sub && <div className="text-[10px] text-[#9aa0b8] mt-1">{m.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-3.5 items-start">
        <div className="flex flex-col gap-3">
          {/* Pipeline */}
          <div className="bg-white border border-[#e0e4ec] rounded-xl py-3.5 px-4 shadow-[0_1px_3px_rgba(26,30,46,.07)]">
            <div className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-3">Pipeline</div>
            <div className="flex flex-col gap-2.5">
              {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, cfg]) => {
                const count = statusCounts[key];
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <span className="w-[82px] text-[12px] font-bold text-[#5a6278] shrink-0">{cfg.label}</span>
                    <div className="flex-1 h-2 bg-[#eceef3] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                    <span className="text-[13px] font-extrabold min-w-[22px] text-right">{count}</span>
                    <span className="text-[11px] text-[#9aa0b8] min-w-[34px] text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dept hours */}
          <div className="bg-white border border-[#e0e4ec] rounded-xl py-3.5 px-4 shadow-[0_1px_3px_rgba(26,30,46,.07)]">
            <div className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-3">Hours by Department</div>
            <div className="flex flex-col gap-2">
              {DEPARTMENTS.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="w-[100px] text-[12px] font-semibold text-[#5a6278] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{d}</span>
                  <div className="flex-1 h-[6px] bg-[#eceef3] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(deptHours[d] / maxDeptHrs) * 100}%`, background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
                    />
                  </div>
                  <span className="text-[11px] text-[#9aa0b8] font-bold min-w-[40px] text-right">{deptHours[d].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Attention needed */}
          <div className="bg-white border border-[#e0e4ec] rounded-xl py-3.5 px-4 shadow-[0_1px_3px_rgba(26,30,46,.07)]">
            <div className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-3">Attention Needed</div>
            {overdue.length === 0 ? (
              <div className="text-[#9aa0b8] text-[12px] text-center py-6">All clear - no overdue projects</div>
            ) : (
              overdue.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start justify-between gap-2 py-[7px] border-b border-[#e0e4ec] last:border-b-0 cursor-pointer group"
                  onClick={() => onSelect(p.id)}
                >
                  <div>
                    <div className="text-[12px] font-bold text-[#1a1e2e] group-hover:text-[#2563eb] transition-colors">#{p.job} — {p.client}</div>
                    <div className="text-[11px] text-[#5a6278] mt-px">{p.description}</div>
                  </div>
                  <span className="text-[10px] font-bold py-[2px] px-[7px] rounded-full shrink-0 whitespace-nowrap mt-px bg-[#fff1f2] text-[#dc2626] border border-[#fecaca]">
                    Overdue
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Clients */}
          <div className="bg-white border border-[#e0e4ec] rounded-xl py-3.5 px-4 shadow-[0_1px_3px_rgba(26,30,46,.07)]">
            <div className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider mb-3">Top Clients</div>
            {topClients.map(([client, data]) => (
              <div key={client} className="flex items-center gap-2.5 py-[5px] border-b border-[#e0e4ec] last:border-b-0">
                <span className="w-[120px] text-[12px] font-semibold text-[#5a6278] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{client}</span>
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {(Object.entries(data.statuses) as [string, number][]).map(([s, n]) => {
                    const cfg = STATUS_CONFIG[s as StatusKey];
                    return cfg ? (
                      <span key={s} className="text-[10px] font-bold py-[2px] px-2 rounded-full whitespace-nowrap border" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                        {n} {cfg.label}
                      </span>
                    ) : null;
                  })}
                </div>
                <span className="text-[12px] font-bold text-[#1a1e2e] min-w-[20px] text-right">{data.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
