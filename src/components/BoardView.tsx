"use client";

import { Project, STATUS_CONFIG, StatusKey } from "@/lib/types";
import { taskProgress } from "@/lib/store";
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
    <div className="absolute inset-0 flex gap-3.5 p-4 px-5 overflow-x-auto overflow-y-hidden items-stretch">
      {COLUMNS.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const items = projects.filter((p) => p.status === status);
        const isDragTarget = dragOver === status;
        return (
          <div
            key={status}
            className={`flex-[0_0_280px] bg-white border rounded-xl flex flex-col transition-all ${
              isDragTarget ? "border-[#2563eb] bg-blue-50/30" : "border-[#dde1ea]"
            }`}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
            onDragEnter={(e) => { e.preventDefault(); setDragOver(status); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); setDragOver(null); if (dragId) onStatusChange(dragId, status); setDragId(null); }}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 py-2.5 px-3.5 border-b border-[#eef0f4] shrink-0 bg-[#f8f9fc] rounded-t-xl">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
              <span className="ml-auto text-[11px] font-bold py-[1px] px-2 rounded-full" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2">
              {items.map((p) => {
                const prog = taskProgress(p);
                const isOverdue = p.dueDate && new Date(p.dueDate) < new Date() && p.status !== "done";
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg py-3 px-3.5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                    style={{
                      border: `1.5px dashed ${cfg.color}60`,
                      borderTopWidth: "3px",
                      borderTopStyle: "solid",
                      borderTopColor: cfg.color,
                    }}
                    draggable
                    onDragStart={() => setDragId(p.id)}
                    onDragEnd={() => { setDragId(null); setDragOver(null); }}
                    onClick={() => onSelect(p.id)}
                  >
                    <div className="text-[11px] font-bold text-[#8892a8] mb-1">Job #{p.job}</div>
                    <div className="text-[14px] font-bold text-[#1a1e2e] mb-0.5">{p.client}</div>
                    <div className="text-[12px] text-[#5a6278] mb-2 leading-relaxed">{p.description}</div>

                    {/* Due date badge */}
                    {p.dueDate && (
                      <div className="mb-2">
                        <span className={`text-[10px] font-bold py-[2px] px-2 rounded ${
                          p.status === "done" ? "bg-[#e8f8ef] text-[#16a34a]"
                          : isOverdue ? "bg-[#fef2f2] text-[#dc2626]"
                          : "bg-[#fff8eb] text-[#d97706]"
                        }`}>
                          Due {new Date(p.dueDate).toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                        </span>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="text-[11px] text-[#8892a8] font-semibold mb-1">{prog.pct}% complete</div>
                    <div className="h-[4px] bg-[#e8eaf0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${prog.pct}%`, background: prog.pct === 100 ? "#16a34a" : "#2563eb" }}
                      />
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="text-[12px] text-[#b0b8c9] text-center py-8">No projects</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
