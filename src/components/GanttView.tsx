"use client";

import { useState } from "react";
import { Project, STATUS_CONFIG, StatusKey } from "@/lib/types";

interface Props {
  projects: Project[];
  onSelect: (id: string) => void;
}

type SortKey = "client" | "job" | "startDate" | "dueDate" | "status";

export default function GanttView({ projects, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("startDate");
  const [sortAsc, setSortAsc] = useState(true);

  const withDates = projects.filter((p) => p.startDate || p.dueDate);
  const noDates = projects.filter((p) => !p.startDate && !p.dueDate);

  // Sort
  const sorted = [...withDates].sort((a, b) => {
    let va = "", vb = "";
    switch (sortKey) {
      case "client": va = a.client; vb = b.client; break;
      case "job": va = a.job; vb = b.job; break;
      case "startDate": va = a.startDate || "9"; vb = b.startDate || "9"; break;
      case "dueDate": va = a.dueDate || "9"; vb = b.dueDate || "9"; break;
      case "status": va = a.status; vb = b.status; break;
    }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const now = new Date();
  let minDate = new Date(now); minDate.setMonth(minDate.getMonth() - 1);
  let maxDate = new Date(now); maxDate.setMonth(maxDate.getMonth() + 6);
  for (const p of withDates) {
    if (p.startDate) { const d = new Date(p.startDate); if (d < minDate) minDate = d; }
    if (p.dueDate) { const d = new Date(p.dueDate); if (d > maxDate) maxDate = d; }
  }

  const totalDays = Math.max(Math.ceil((maxDate.getTime() - minDate.getTime()) / 86400000), 30);

  const months: { label: string; left: number; width: number }[] = [];
  const d = new Date(minDate); d.setDate(1);
  while (d <= maxDate) {
    const mStart = new Date(d);
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const dayStart = Math.max(0, Math.ceil((mStart.getTime() - minDate.getTime()) / 86400000));
    const dayEnd = Math.min(totalDays, Math.ceil((mEnd.getTime() - minDate.getTime()) / 86400000));
    months.push({ label: mStart.toLocaleDateString("en", { month: "short", year: "numeric" }).toUpperCase(), left: (dayStart / totalDays) * 100, width: ((dayEnd - dayStart) / totalDays) * 100 });
    d.setMonth(d.getMonth() + 1);
  }

  const todayPct = Math.max(0, Math.min(100, ((now.getTime() - minDate.getTime()) / 86400000 / totalDays) * 100));

  function getBar(p: Project) {
    const start = p.startDate ? new Date(p.startDate) : now;
    const end = p.dueDate ? new Date(p.dueDate) : new Date(start.getTime() + 14 * 86400000);
    const leftPct = ((start.getTime() - minDate.getTime()) / 86400000 / totalDays) * 100;
    const widthPct = ((end.getTime() - start.getTime()) / 86400000 / totalDays) * 100;
    const cfg = STATUS_CONFIG[p.status as StatusKey];
    const isOverdue = p.dueDate && new Date(p.dueDate) < now && p.status !== "done";
    return {
      left: `${Math.max(0, leftPct)}%`,
      width: `${Math.max(2, Math.min(100 - Math.max(0, leftPct), widthPct))}%`,
      background: isOverdue ? "#ef4444" : p.status === "done" ? "#16a34a" : cfg?.color || "#d97706",
      borderRadius: "4px",
      isSmall: widthPct < 3,
    };
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  const sortBtns: { key: SortKey; label: string }[] = [
    { key: "client", label: "Client" },
    { key: "job", label: "Job #" },
    { key: "startDate", label: "Start Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 px-5">
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider">Sort by</span>
        {sortBtns.map((b) => (
          <button
            key={b.key}
            onClick={() => handleSort(b.key)}
            className={`text-[12px] font-bold py-1 px-3 rounded-lg cursor-pointer transition-all ${
              sortKey === b.key
                ? "bg-[#2563eb] text-white shadow-sm"
                : "bg-white border border-[#dde1ea] text-[#5a6278] hover:border-[#2563eb] hover:text-[#2563eb]"
            }`}
          >
            {b.label}{sortKey === b.key ? (sortAsc ? " ↑" : " ↓") : ""}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#dde1ea] rounded-xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
        {/* Month headers */}
        <div className="relative h-9 bg-[#f4f6fa] border-b border-[#dde1ea] flex items-end">
          <div className="w-[230px] shrink-0" />
          <div className="flex-1 relative min-w-0 h-full">
            {months.map((m, i) => (
              <div key={i} className="absolute text-[10px] font-bold text-[#8892a8] uppercase tracking-wider pb-2 px-2 border-l border-[#e8eaf0]" style={{ left: `${m.left}%`, width: `${m.width}%` }}>
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Rows with dates */}
        {sorted.map((p, i) => {
          const bar = getBar(p);
          return (
            <div
              key={p.id}
              className={`flex items-center border-b border-[#eef0f4] cursor-pointer hover:bg-[#edf2ff] transition-colors ${i % 2 === 1 ? "bg-[#f8f9fc]" : ""}`}
              onClick={() => onSelect(p.id)}
            >
              <div className="w-[230px] shrink-0 py-2.5 px-3.5 border-r border-[#e8eaf0]">
                <div className="text-[13px] font-bold text-[#1a1e2e]">{p.client}</div>
                <div className="text-[10px] text-[#8892a8]">Job #{p.job} · {p.description?.substring(0, 30)}{(p.description?.length || 0) > 30 ? "..." : ""}</div>
              </div>
              <div className="flex-1 relative h-[44px] min-w-0">
                {/* Today line */}
                <div className="absolute top-0 bottom-0 z-10" style={{ left: `${todayPct}%` }}>
                  <div className="w-px h-full bg-[#dc2626]/40" style={{ borderLeft: "1px dashed rgba(220,38,38,.4)" }} />
                </div>
                {/* Bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[22px] flex items-center justify-center text-white text-[10px] font-bold shadow-sm overflow-hidden"
                  style={{ left: bar.left, width: bar.width, background: bar.background, borderRadius: bar.borderRadius }}
                >
                  {!bar.isSmall ? p.job : ""}
                </div>
                {/* Green dot for completed/very short */}
                {bar.isSmall && p.status === "done" && (
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#16a34a] border-2 border-white shadow" style={{ left: bar.left }} />
                )}
              </div>
            </div>
          );
        })}

        {noDates.length > 0 && (
          <div className="bg-[#f4f6fa] border-t border-[#dde1ea] py-2 px-3.5">
            <span className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider">No Dates ({noDates.length} projects)</span>
          </div>
        )}

        {projects.length === 0 && (
          <div className="py-16 text-center text-[#9ca3af] text-sm">No projects found</div>
        )}
      </div>
    </div>
  );
}
