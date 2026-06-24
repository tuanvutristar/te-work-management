"use client";

import { TabName, Project, STATUS_CONFIG } from "@/lib/types";
import { ReactNode } from "react";

interface Props {
  currentTab: TabName;
  onTabChange: (tab: TabName) => void;
  projects: Project[];
}

const TABS: { id: TabName; label: string; icon: ReactNode }[] = [
  {
    id: "table", label: "Table View",
    icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>
  },
  {
    id: "board", label: "Board",
    icon: <><rect x="3" y="3" width="5" height="18" rx="1" /><rect x="10" y="3" width="5" height="12" rx="1" /><rect x="17" y="3" width="5" height="15" rx="1" /></>
  },
  {
    id: "summary", label: "Dashboard",
    icon: <><path d="M18 20V10M12 20V4M6 20v-6" /></>
  },
  {
    id: "gantt", label: "Timeline",
    icon: <><path d="M3 6h18M3 12h12M3 18h8" /></>
  },
  {
    id: "people", label: "People",
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>
  },
];

export default function Sidebar({ currentTab, onTabChange, projects }: Props) {
  const counts = {
    todo: projects.filter((p) => p.status === "todo").length,
    active: projects.filter((p) => p.status === "active").length,
    inprogress: projects.filter((p) => p.status === "inprogress").length,
    done: projects.filter((p) => p.status === "done").length,
  };

  return (
    <aside
      className="w-[200px] flex flex-col shrink-0 overflow-y-auto overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #162032 100%)" }}
    >
      <div className="py-3 flex-1">
        <span className="block text-[9px] font-extrabold text-white/20 uppercase tracking-[.14em] px-5 pt-2 pb-2">
          Views
        </span>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 w-full py-[9px] px-5 border-none text-[13px] font-semibold cursor-pointer transition-all text-left tracking-tight relative ${
              currentTab === tab.id
                ? "text-white bg-white/[.08]"
                : "text-white/40 hover:text-white/70 hover:bg-white/[.04]"
            }`}
          >
            {currentTab === tab.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }} />
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-opacity ${currentTab === tab.id ? "opacity-100" : "opacity-50"}`}>
              {tab.icon}
            </svg>
            {tab.label}
          </button>
        ))}

        <div className="mx-5 my-3 h-px bg-white/[.06]" />

        <span className="block text-[9px] font-extrabold text-white/20 uppercase tracking-[.14em] px-5 pb-2">
          Status
        </span>
        {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2.5 px-5 py-[5px] group">
            <span className="w-[7px] h-[7px] rounded-full shrink-0 ring-2 ring-transparent group-hover:ring-white/10 transition-all" style={{ background: cfg.color }} />
            <span className="text-[12px] text-white/35 font-medium flex-1 group-hover:text-white/55 transition-colors">{cfg.label}</span>
            <span className="text-[10px] font-bold px-[6px] py-[1px] rounded-md bg-white/[.06] text-white/40 tabular-nums">
              {counts[key as keyof typeof counts]}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[.05]">
        <div className="text-[10px] text-white/15 font-medium text-center tracking-wide">
          TE Work Management v1.0
        </div>
      </div>
    </aside>
  );
}
