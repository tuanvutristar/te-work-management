"use client";

import { Project, STATUS_CONFIG, StatusKey } from "@/lib/types";

interface Props {
  projects: Project[];
  onSelect: (id: string) => void;
}

export default function GanttView({ projects, onSelect }: Props) {
  const withDates = projects.filter((p) => p.startDate || p.dueDate);
  const noDates = projects.filter((p) => !p.startDate && !p.dueDate);

  const now = new Date();
  let minDate = new Date(now);
  let maxDate = new Date(now);
  minDate.setMonth(minDate.getMonth() - 1);
  maxDate.setMonth(maxDate.getMonth() + 3);

  for (const p of withDates) {
    if (p.startDate) { const d = new Date(p.startDate); if (d < minDate) minDate = d; }
    if (p.dueDate) { const d = new Date(p.dueDate); if (d > maxDate) maxDate = d; }
  }

  const totalDays = Math.max(Math.ceil((maxDate.getTime() - minDate.getTime()) / 86400000), 30);

  const months: { label: string; left: number; width: number }[] = [];
  const d = new Date(minDate);
  d.setDate(1);
  while (d <= maxDate) {
    const mStart = new Date(d);
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const dayStart = Math.max(0, Math.ceil((mStart.getTime() - minDate.getTime()) / 86400000));
    const dayEnd = Math.min(totalDays, Math.ceil((mEnd.getTime() - minDate.getTime()) / 86400000));
    months.push({
      label: mStart.toLocaleDateString("en", { month: "short", year: "numeric" }),
      left: (dayStart / totalDays) * 100,
      width: ((dayEnd - dayStart) / totalDays) * 100,
    });
    d.setMonth(d.getMonth() + 1);
  }

  const todayPct = ((now.getTime() - minDate.getTime()) / 86400000 / totalDays) * 100;

  function getBarStyle(p: Project) {
    const start = p.startDate ? new Date(p.startDate) : now;
    const end = p.dueDate ? new Date(p.dueDate) : new Date(start.getTime() + 30 * 86400000);
    const leftPct = ((start.getTime() - minDate.getTime()) / 86400000 / totalDays) * 100;
    const widthPct = ((end.getTime() - start.getTime()) / 86400000 / totalDays) * 100;
    const cfg = STATUS_CONFIG[p.status as StatusKey];
    const isOverdue = p.dueDate && new Date(p.dueDate) < now && p.status !== "done";
    return {
      left: `${Math.max(0, leftPct)}%`,
      width: `${Math.max(2, Math.min(100 - Math.max(0, leftPct), widthPct))}%`,
      background: isOverdue
        ? "linear-gradient(90deg, #ef4444, #dc2626)"
        : `linear-gradient(90deg, ${cfg?.color}, ${cfg?.color}cc)`,
      borderRadius: "6px",
    };
  }

  return (
    <div className="absolute inset-0 overflow-y-auto p-5 animate-fade-in">
      <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 24px rgba(0,0,0,.06)" }}>
        {/* Month headers */}
        <div className="relative h-10 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-end">
          {months.map((m, i) => (
            <div
              key={i}
              className="absolute text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider pb-2.5 px-3 border-l border-[#e5e7eb] first:border-l-0"
              style={{ left: `${m.left}%`, width: `${m.width}%` }}
            >
              {m.label}
            </div>
          ))}
          {/* Today marker label */}
          <div className="absolute top-1 text-[8px] font-bold text-red-500 bg-red-50 px-1 rounded -translate-x-1/2 z-20" style={{ left: `${todayPct}%` }}>
            TODAY
          </div>
        </div>

        {/* Rows with dates */}
        {withDates.map((p, i) => {
          const barStyle = getBarStyle(p);
          const cfg = STATUS_CONFIG[p.status as StatusKey];
          return (
            <div
              key={p.id}
              className={`flex items-center border-b border-[#f3f4f6] cursor-pointer transition-colors group ${
                i % 2 === 1 ? "bg-[#fafbfc]" : "bg-white"
              } hover:bg-blue-50/40`}
              onClick={() => onSelect(p.id)}
            >
              <div className="w-[240px] shrink-0 py-2.5 px-4 border-r border-[#e5e7eb]">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#94a3b8] bg-[#f1f5f9] px-1.5 py-0.5 rounded">#{p.job}</span>
                  <span className="w-[5px] h-[5px] rounded-full" style={{ background: cfg?.color }} />
                </div>
                <div className="text-[12px] font-semibold text-[#111827] truncate group-hover:text-[#2563eb] transition-colors">{p.client}</div>
                <div className="text-[10px] text-[#9ca3af] truncate">{p.description}</div>
              </div>
              <div className="flex-1 relative h-12 min-w-0">
                {/* Today line */}
                <div className="absolute top-0 bottom-0 w-px bg-red-400/30 z-10" style={{ left: `${todayPct}%` }} />
                {/* Bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[22px] rounded-md opacity-80 group-hover:opacity-100 transition-all shadow-sm group-hover:shadow-md"
                  style={barStyle}
                >
                  <div className="h-full rounded-md flex items-center px-2.5 text-white text-[9px] font-bold whitespace-nowrap overflow-hidden drop-shadow-sm">
                    {p.startDate && p.dueDate ? `${p.startDate} → ${p.dueDate}` : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* No-date section */}
        {noDates.length > 0 && (
          <>
            <div className="bg-[#f9fafb] border-b border-t border-[#e5e7eb] py-2 px-4">
              <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">
                No Dates Assigned ({noDates.length})
              </span>
            </div>
            {noDates.map((p, i) => {
              const cfg = STATUS_CONFIG[p.status as StatusKey];
              return (
                <div
                  key={p.id}
                  className={`flex items-center border-b border-[#f3f4f6] cursor-pointer transition-colors group hover:bg-blue-50/40 ${
                    i % 2 === 1 ? "bg-[#fafbfc]" : "bg-white"
                  }`}
                  onClick={() => onSelect(p.id)}
                >
                  <div className="w-[240px] shrink-0 py-2.5 px-4 border-r border-[#e5e7eb]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#94a3b8] bg-[#f1f5f9] px-1.5 py-0.5 rounded">#{p.job}</span>
                      <span className="w-[5px] h-[5px] rounded-full" style={{ background: cfg?.color }} />
                    </div>
                    <div className="text-[12px] font-semibold text-[#111827] truncate group-hover:text-[#2563eb] transition-colors">{p.client}</div>
                  </div>
                  <div className="flex-1 flex items-center px-4 h-12">
                    <span className="text-[11px] text-[#d1d5db] italic flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      No dates assigned
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {projects.length === 0 && (
          <div className="py-16 text-center text-[#d1d5db] text-sm font-medium">No projects found</div>
        )}
      </div>
    </div>
  );
}
