"use client";

import { Project, STATUS_CONFIG, StatusKey, DEPARTMENTS } from "@/lib/types";
import { totalHrs, taskProgress } from "@/lib/store";

interface Props {
  projects: Project[];
  filtered: Project[];
  onSelect: (id: string) => void;
}

export default function SummaryView({ projects, onSelect }: Props) {
  const all = projects;
  const total = all.length;
  const statusCounts = {
    todo: all.filter((p) => p.status === "todo").length,
    active: all.filter((p) => p.status === "active").length,
    inprogress: all.filter((p) => p.status === "inprogress").length,
    done: all.filter((p) => p.status === "done").length,
  };
  const activeInProg = statusCounts.active + statusCounts.inprogress;
  const avgProgress = total > 0 ? Math.round(all.reduce((s, p) => s + taskProgress(p).pct, 0) / total) : 0;
  const overdue = all.filter((p) => p.status !== "done" && p.dueDate && new Date(p.dueDate) < new Date());
  const remainingHrs = all.filter((p) => p.status !== "done").reduce((s, p) => s + totalHrs(p), 0);

  // Client breakdown
  const clientMap = new Map<string, { total: number; statuses: Record<string, number> }>();
  for (const p of all) {
    if (!clientMap.has(p.client)) clientMap.set(p.client, { total: 0, statuses: {} });
    const e = clientMap.get(p.client)!;
    e.total++;
    e.statuses[p.status] = (e.statuses[p.status] || 0) + 1;
  }
  const topClients = Array.from(clientMap.entries()).sort((a, b) => b[1].total - a[1].total).slice(0, 12);

  // Dept workload
  const deptData: Record<string, { jobs: number; hrs: number }> = {};
  for (const d of DEPARTMENTS) deptData[d] = { jobs: 0, hrs: 0 };
  for (const p of all) {
    for (const [d, info] of Object.entries(p.departments)) {
      if (!deptData[d]) deptData[d] = { jobs: 0, hrs: 0 };
      if (info.pm || info.hrs) deptData[d].jobs++;
      deptData[d].hrs += info.hrs || 0;
    }
  }
  const maxJobs = Math.max(...Object.values(deptData).map((d) => d.jobs), 1);
  const maxHrs = Math.max(...Object.values(deptData).map((d) => d.hrs), 1);

  const metricCards = [
    { label: "Total Jobs", val: total, sub: "all statuses", color: "#6b7a96", borderColor: "#dde1ea" },
    { label: "Active / In Prog", val: activeInProg, sub: `${statusCounts.active} · ${statusCounts.inprogress} in progress`, color: "#d97706", borderColor: "#fde68a" },
    { label: "To Do", val: statusCounts.todo, sub: "not yet started", color: "#0ea5e9", borderColor: "#bae6fd" },
    { label: "Done", val: statusCounts.done, sub: `${total > 0 ? Math.round((statusCounts.done / total) * 100) : 0}% of all jobs`, color: "#16a34a", borderColor: "#bbf7d0" },
    { label: "Overdue", val: overdue.length, sub: overdue.length === 0 ? "all on track" : "needs attention", color: overdue.length > 0 ? "#dc2626" : "#16a34a", borderColor: overdue.length > 0 ? "#fecaca" : "#bbf7d0" },
    { label: "Avg Complete", val: `${avgProgress}%`, sub: "across all jobs", color: "#7c3aed", borderColor: "#ddd6fe" },
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 px-5">
      {/* Metric cards row */}
      <div className="grid grid-cols-6 gap-3 mb-3">
        {metricCards.map((m) => (
          <div key={m.label} className="bg-white border rounded-xl py-3 px-3.5" style={{ borderColor: m.borderColor, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="text-[9px] font-extrabold uppercase tracking-wider mb-1" style={{ color: m.color }}>{m.label}</div>
            <div className="text-[26px] font-extrabold text-[#1a1e2e] leading-none tracking-tight">{m.val}</div>
            <div className="text-[10px] text-[#8892a8] mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Remaining hours card */}
      <div className="mb-3">
        <div className="bg-white border border-[#dde1ea] rounded-xl py-3 px-3.5 inline-block" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <div className="text-[9px] font-extrabold text-[#8892a8] uppercase tracking-wider mb-1">Remaining Hrs</div>
          <div className="text-[26px] font-extrabold text-[#1a1e2e] leading-none tracking-tight">{remainingHrs.toLocaleString()}</div>
          <div className="text-[10px] text-[#8892a8] mt-1">excl. completed jobs</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          {/* Status Pipeline */}
          <div className="bg-white border border-[#dde1ea] rounded-xl py-3.5 px-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider mb-3">Status Pipeline</div>
            <div className="flex flex-col gap-2.5">
              {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, cfg]) => {
                const count = statusCounts[key];
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <span className="w-[90px] text-[12px] font-semibold text-[#5a6278] shrink-0">{cfg.label}</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                    <div className="flex-1 h-[6px] bg-[#e8eaf0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                    <span className="text-[13px] font-extrabold min-w-[24px] text-right tabular-nums" style={{ color: cfg.color }}>{count}</span>
                    <span className="text-[11px] text-[#8892a8] min-w-[30px] text-right tabular-nums">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Workload */}
          <div className="bg-white border border-[#dde1ea] rounded-xl py-3.5 px-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider">Department Workload</span>
              <span className="flex items-center gap-1 text-[9px] text-[#d97706] font-bold"><span className="w-2 h-2 rounded-full bg-[#d97706]" />Active</span>
              <span className="flex items-center gap-1 text-[9px] text-[#2563eb] font-bold"><span className="w-2 h-2 rounded-full bg-[#2563eb]" />Hours</span>
            </div>
            <div className="flex flex-col gap-3">
              {DEPARTMENTS.map((d) => (
                <div key={d}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-[#5a6278]">{d}</span>
                    <span className="text-[10px] text-[#8892a8] font-bold tabular-nums">{deptData[d].jobs} jobs<br/>{deptData[d].hrs.toLocaleString()} hrs</span>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <div className="h-[5px] bg-[#e8eaf0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(deptData[d].jobs / maxJobs) * 100}%`, background: "#d97706" }} />
                    </div>
                    <div className="h-[5px] bg-[#e8eaf0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(deptData[d].hrs / maxHrs) * 100}%`, background: "#2563eb" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Projects by Client */}
        <div className="bg-white border border-[#dde1ea] rounded-xl py-3.5 px-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <div className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider mb-3">Projects by Client</div>
          <div className="space-y-0.5">
            {topClients.map(([client, data]) => (
              <div key={client} className="flex items-center gap-3 py-[6px] border-b border-[#f0f2f5] last:border-b-0">
                <span className="text-[12px] font-semibold text-[#1a1e2e] w-[130px] shrink-0 truncate">{client}</span>
                <div className="flex gap-1 flex-wrap flex-1">
                  {(Object.entries(data.statuses) as [string, number][]).map(([s, n]) => {
                    const c = STATUS_CONFIG[s as StatusKey];
                    return c ? (
                      <span key={s} className="text-[10px] font-bold py-[1px] px-2 rounded whitespace-nowrap" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                        {n} {c.label}
                      </span>
                    ) : null;
                  })}
                </div>
                <span className="text-[12px] font-bold text-[#1a1e2e] min-w-[16px] text-right tabular-nums">{data.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
