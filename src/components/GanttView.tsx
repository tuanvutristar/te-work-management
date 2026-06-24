"use client";

import { Project, STATUS_CONFIG, StatusKey, DEPARTMENTS } from "@/lib/types";

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
    if (p.startDate) {
      const d = new Date(p.startDate);
      if (d < minDate) minDate = d;
    }
    if (p.dueDate) {
      const d = new Date(p.dueDate);
      if (d > maxDate) maxDate = d;
    }
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
    return {
      left: `${Math.max(0, leftPct)}%`,
      width: `${Math.max(2, Math.min(100 - Math.max(0, leftPct), widthPct))}%`,
      background: cfg?.color || "#2563eb",
    };
  }

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 px-5">
      <div className="bg-white border border-[#e0e4ec] rounded-xl shadow-[0_4px_20px_rgba(26,30,46,.11)] overflow-hidden">
        {/* Month headers */}
        <div className="relative h-8 bg-[#f6f7fa] border-b border-[#e0e4ec] flex items-end">
          {months.map((m, i) => (
            <div
              key={i}
              className="absolute text-[10px] font-bold text-[#9aa0b8] uppercase tracking-wider pb-1.5 px-2 border-l border-[#e0e4ec]"
              style={{ left: `${m.left}%`, width: `${m.width}%` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Rows with dates */}
        {withDates.map((p, i) => {
          const barStyle = getBarStyle(p);
          return (
            <div
              key={p.id}
              className={`flex items-center border-b border-[#e0e4ec] cursor-pointer hover:bg-[#eff6ff] transition-colors ${i % 2 === 1 ? "bg-[rgba(240,244,248,.35)]" : ""}`}
              onClick={() => onSelect(p.id)}
            >
              <div className="w-[220px] shrink-0 py-2 px-3 border-r border-[#e0e4ec]">
                <div className="text-[11px] font-bold text-[#9aa0b8]">#{p.job}</div>
                <div className="text-[12px] font-bold text-[#1a1e2e] truncate">{p.client}</div>
                <div className="text-[11px] text-[#5a6278] truncate">{p.description}</div>
              </div>
              <div className="flex-1 relative h-10 min-w-0">
                {/* Today line */}
                <div className="absolute top-0 bottom-0 w-px bg-[#dc2626]/30 z-10" style={{ left: `${todayPct}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[18px] rounded-md opacity-85 hover:opacity-100 transition-opacity"
                  style={barStyle}
                  title={`${p.startDate || "No start"} → ${p.dueDate || "No end"}`}
                >
                  <div className="h-full rounded-md flex items-center px-2 text-white text-[9px] font-bold whitespace-nowrap overflow-hidden">
                    {p.startDate && p.dueDate ? `${p.startDate} → ${p.dueDate}` : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Rows without dates */}
        {noDates.length > 0 && (
          <>
            <div className="bg-[#f6f7fa] border-b border-[#e0e4ec] py-1.5 px-3">
              <span className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider">
                No Dates Set ({noDates.length})
              </span>
            </div>
            {noDates.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center border-b border-[#e0e4ec] cursor-pointer hover:bg-[#eff6ff] transition-colors ${i % 2 === 1 ? "bg-[rgba(240,244,248,.35)]" : ""}`}
                onClick={() => onSelect(p.id)}
              >
                <div className="w-[220px] shrink-0 py-2 px-3 border-r border-[#e0e4ec]">
                  <div className="text-[11px] font-bold text-[#9aa0b8]">#{p.job}</div>
                  <div className="text-[12px] font-bold text-[#1a1e2e] truncate">{p.client}</div>
                  <div className="text-[11px] text-[#5a6278] truncate">{p.description}</div>
                </div>
                <div className="flex-1 relative h-10 min-w-0 flex items-center px-4">
                  <span className="text-[11px] text-[#9aa0b8] italic">No dates assigned</span>
                </div>
              </div>
            ))}
          </>
        )}

        {projects.length === 0 && (
          <div className="py-12 text-center text-[#9aa0b8] text-sm">No projects found</div>
        )}
      </div>
    </div>
  );
}
