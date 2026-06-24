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
  const avgProgress = total > 0 ? Math.round(all.reduce((s, p) => s + taskProgress(p).pct, 0) / total) : 0;

  const clientMap = new Map<string, { total: number; statuses: Record<string, number> }>();
  for (const p of all) {
    if (!clientMap.has(p.client)) clientMap.set(p.client, { total: 0, statuses: {} });
    const entry = clientMap.get(p.client)!;
    entry.total++;
    entry.statuses[p.status] = (entry.statuses[p.status] || 0) + 1;
  }
  const topClients = Array.from(clientMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 8);

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

  const metrics = [
    { label: "Total Projects", val: total, color: "#3b82f6", gradient: "from-blue-500 to-blue-600", icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
    { label: "To Do", val: statusCounts.todo, color: "#0ea5e9", gradient: "from-sky-400 to-sky-500", icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></> },
    { label: "Active", val: statusCounts.active, color: "#7c3aed", gradient: "from-violet-500 to-violet-600", icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></> },
    { label: "In Progress", val: statusCounts.inprogress, color: "#d97706", gradient: "from-amber-500 to-amber-600", icon: <><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" /></> },
    { label: "Completed", val: statusCounts.done, color: "#16a34a", gradient: "from-emerald-500 to-emerald-600", icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></> },
    { label: "Total Hours", val: totalHours.toLocaleString(), color: "#6366f1", gradient: "from-indigo-500 to-indigo-600", sub: `${avgProgress}% avg progress`, icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></> },
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto p-5 animate-fade-in">
      {/* Metrics */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-[#e5e7eb] rounded-2xl py-4 px-4 card-hover relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${m.gradient}`} />
            <div className="flex items-start justify-between mb-2">
              <div className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider">{m.label}</div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: `${m.color}10` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
              </div>
            </div>
            <div className="text-[24px] font-extrabold tracking-tight leading-none" style={{ color: m.color }}>{m.val}</div>
            {m.sub && <div className="text-[10px] text-[#9ca3af] mt-1.5 font-medium">{m.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          {/* Pipeline */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl py-4 px-5 card-hover">
            <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-4">Pipeline Overview</div>
            <div className="flex flex-col gap-3">
              {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, cfg]) => {
                const count = statusCounts[key];
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={key} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-[#6b7280] group-hover:text-[#111827] transition-colors">{cfg.label}</span>
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: cfg.color }}>{count} <span className="text-[#d1d5db] font-normal">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}cc)` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dept hours */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl py-4 px-5 card-hover">
            <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-4">Hours by Department</div>
            <div className="flex flex-col gap-2.5">
              {DEPARTMENTS.map((d) => (
                <div key={d} className="flex items-center gap-2.5 group">
                  <span className="w-[90px] text-[11px] font-medium text-[#6b7280] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-[#111827] transition-colors">{d}</span>
                  <div className="flex-1 h-[6px] bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(deptHours[d] / maxDeptHrs) * 100}%`, background: "linear-gradient(90deg, #3b82f6, #6366f1)" }}
                    />
                  </div>
                  <span className="text-[10px] text-[#9ca3af] font-bold min-w-[40px] text-right tabular-nums">{deptHours[d].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Attention needed */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl py-4 px-5 card-hover">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Attention Needed</div>
              {overdue.length > 0 && (
                <span className="text-[9px] font-bold px-2 py-[2px] rounded-full bg-red-50 text-red-500 border border-red-200">{overdue.length} overdue</span>
              )}
            </div>
            {overdue.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-[#d1d5db]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
                </svg>
                <span className="text-[12px] font-medium">All clear — no overdue projects</span>
              </div>
            ) : (
              <div className="space-y-1">
                {overdue.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl cursor-pointer hover:bg-red-50/50 transition-colors group -mx-1"
                    onClick={() => onSelect(p.id)}
                  >
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#111827] group-hover:text-[#2563eb] transition-colors truncate">
                        <span className="text-[#94a3b8] font-mono">#{p.job}</span> — {p.client}
                      </div>
                      <div className="text-[11px] text-[#6b7280] truncate">{p.description}</div>
                    </div>
                    <span className="text-[9px] font-bold py-1 px-2 rounded-lg shrink-0 bg-red-50 text-red-500 border border-red-200">
                      Due {p.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Clients */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl py-4 px-5 card-hover">
            <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-3">Top Clients</div>
            <div className="space-y-0.5">
              {topClients.map(([client, data], i) => (
                <div key={client} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#f8fafc] transition-colors -mx-1">
                  <span className="w-5 h-5 rounded-md bg-[#f1f5f9] flex items-center justify-center text-[10px] font-bold text-[#94a3b8] shrink-0">{i + 1}</span>
                  <span className="text-[12px] font-semibold text-[#374151] flex-1 truncate">{client}</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {(Object.entries(data.statuses) as [string, number][]).map(([s, n]) => {
                      const c = STATUS_CONFIG[s as StatusKey];
                      return c ? (
                        <span key={s} className="text-[9px] font-bold py-[2px] px-1.5 rounded-md" style={{ background: c.bg, color: c.color }}>
                          {n}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <span className="text-[12px] font-bold text-[#374151] min-w-[16px] text-right tabular-nums">{data.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
