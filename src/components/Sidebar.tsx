"use client";

import { TabName, Project, STATUS_CONFIG } from "@/lib/types";

interface Props {
  currentTab: TabName;
  onTabChange: (tab: TabName) => void;
  projects: Project[];
}

const TABS: { id: TabName; label: string; icon: string }[] = [
  { id: "table", label: "Table View", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { id: "board", label: "Board", icon: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" },
  { id: "summary", label: "Summary", icon: "M18 20V10M12 20V4M6 20v-6" },
  { id: "gantt", label: "Timeline", icon: "M8 6h13M8 12h9M8 18h5M3 6h.01M3 12h.01M3 18h.01" },
  { id: "people", label: "People", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
];

export default function Sidebar({ currentTab, onTabChange, projects }: Props) {
  const counts = {
    todo: projects.filter((p) => p.status === "todo").length,
    active: projects.filter((p) => p.status === "active").length,
    inprogress: projects.filter((p) => p.status === "inprogress").length,
    done: projects.filter((p) => p.status === "done").length,
  };

  return (
    <aside className="w-[196px] flex flex-col shrink-0 overflow-y-auto overflow-x-hidden border-r border-white/[.08]" style={{ background: "#1a2d4a" }}>
      <div className="py-2 flex-1">
        <span className="block text-[9px] font-extrabold text-white/25 uppercase tracking-widest px-4 pt-3 pb-1.5">
          Navigation
        </span>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 w-full py-2.5 px-4 border-none border-l-[3px] text-[13px] font-semibold cursor-pointer transition-all text-left tracking-tight ${
              currentTab === tab.id
                ? "text-white bg-white/10 border-l-[3px] border-l-[#2563eb]"
                : "text-white/50 border-l-[3px] border-l-transparent hover:text-white/85 hover:bg-white/[.07]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${currentTab === tab.id ? "opacity-100" : "opacity-70"}`}>
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}

        <span className="block text-[9px] font-extrabold text-white/25 uppercase tracking-widest px-4 pt-5 pb-1.5">
          Status
        </span>
        {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2.5 px-4 py-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
            <span className="text-[12px] text-white/50 font-semibold flex-1">{cfg.label}</span>
            <span className="text-[10px] font-bold px-[7px] py-px rounded-full bg-white/15 text-white/70">
              {counts[key as keyof typeof counts]}
            </span>
          </div>
        ))}
      </div>
      <div className="p-2.5 pb-3.5 border-t border-white/[.08]">
        <div className="text-[10px] text-white/30 font-semibold text-center">
          TE Work Management v1.0
        </div>
      </div>
    </aside>
  );
}
