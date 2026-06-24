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
        return (
          <div
            key={status}
            className={`flex-[0_0_276px] bg-white border border-[#e0e4ec] rounded-xl flex flex-col shadow-[0_4px_20px_rgba(26,30,46,.11)] transition-colors ${
              dragOver === status ? "border-[#2563eb] bg-[#eff6ff]" : ""
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
            <div className="flex items-center gap-[7px] py-[11px] px-3.5 border-b border-[#e0e4ec] shrink-0 bg-[#f6f7fa] rounded-t-xl">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
              <span
                className="ml-auto text-[11px] font-bold py-px px-[7px] rounded-full border"
                style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
              >
                {items.length}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-2">
              {items.map((p) => {
                const prog = taskProgress(p);
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-[#e0e4ec] rounded-lg py-[11px] px-[13px] mb-[7px] cursor-pointer transition-all shadow-[0_1px_3px_rgba(26,30,46,.07)] hover:border-[#bfdbfe] hover:shadow-[0_4px_20px_rgba(26,30,46,.11)] hover:-translate-y-0.5 relative"
                    style={{ borderTopWidth: 3, borderTopColor: cfg.color }}
                    draggable
                    onDragStart={() => setDragId(p.id)}
                    onDragEnd={() => { setDragId(null); setDragOver(null); }}
                    onClick={() => onSelect(p.id)}
                  >
                    <div className="text-[10px] font-bold text-[#9aa0b8] mb-[3px] tracking-wide">
                      #{p.job}
                    </div>
                    <div className="text-[13px] font-bold text-[#1a1e2e] mb-[2px]">{p.client}</div>
                    <div className="text-[11px] text-[#5a6278] mb-2 leading-[1.45]">{p.description}</div>
                    <div className="h-1 bg-[#eceef3] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${prog.pct}%`, background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
                      />
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="text-[12px] text-[#9aa0b8] text-center py-6">
                  No projects
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
