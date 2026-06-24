"use client";

import { Project, STATUS_CONFIG, StatusKey } from "@/lib/types";
import { taskProgress, totalHrs } from "@/lib/store";
import { useState } from "react";

interface Props {
  projects: Project[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: StatusKey) => void;
}

const COLUMNS: StatusKey[] = ["todo", "active", "inprogress", "done"];

export default function BoardView({ projects, onSelect, onStatusChange }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 flex gap-4 p-5 overflow-x-auto overflow-y-hidden items-stretch animate-fade-in">
      {COLUMNS.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const items = projects.filter((p) => p.status === status);
        const isDragTarget = dragOver === status;
        return (
          <div
            key={status}
            className={`flex-[0_0_280px] bg-white/60 backdrop-blur-sm border rounded-2xl flex flex-col transition-all duration-200 ${
              isDragTarget
                ? "border-blue-300 bg-blue-50/50 scale-[1.01] shadow-lg shadow-blue-100/50"
                : "border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,.04)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
            onDragEnter={(e) => { e.preventDefault(); setDragOver(status); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              if (dragId) onStatusChange(dragId, status);
              setDragId(null);
            }}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 py-3 px-4 border-b border-[#f3f4f6] shrink-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cfg.color, boxShadow: `0 0 0 2px white, 0 0 0 4px ${cfg.color}30` }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
              <span
                className="ml-auto text-[11px] font-bold py-[2px] px-2 rounded-md"
                style={{ color: cfg.color, background: cfg.bg }}
              >
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-2">
              {items.map((p) => {
                const prog = taskProgress(p);
                const hrs = totalHrs(p);
                return (
                  <div
                    key={p.id}
                    className={`bg-white border border-[#e5e7eb] rounded-xl py-3 px-3.5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#d1d5db] active:scale-[0.98] ${
                      status === "done" ? "opacity-70 hover:opacity-100" : ""
                    }`}
                    style={{ borderTopWidth: 3, borderTopColor: cfg.color }}
                    draggable
                    onDragStart={() => setDragId(p.id)}
                    onDragEnd={() => { setDragId(null); setDragOver(null); }}
                    onClick={() => onSelect(p.id)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#94a3b8] bg-[#f8fafc] px-1.5 py-0.5 rounded">
                        #{p.job}
                      </span>
                      {hrs > 0 && (
                        <span className="text-[9px] font-semibold text-[#94a3b8]">{hrs}h</span>
                      )}
                    </div>
                    <div className="text-[13px] font-semibold text-[#111827] mb-0.5 leading-snug">{p.client}</div>
                    <div className="text-[11px] text-[#6b7280] mb-3 leading-relaxed line-clamp-2">{p.description}</div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${prog.pct === 100 ? "bg-emerald-500" : ""}`}
                          style={{ width: `${prog.pct}%`, ...( prog.pct < 100 ? { background: "linear-gradient(90deg, #3b82f6, #6366f1)" } : {}) }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-[#94a3b8] tabular-nums">{prog.pct}%</span>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-[#d1d5db]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-50">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v4m0 4h.01" />
                  </svg>
                  <span className="text-[11px] font-medium">No projects</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
