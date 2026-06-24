"use client";

import { TabName, Project } from "@/lib/types";
import { ReactNode } from "react";

interface Props {
  currentTab: TabName;
  onTabChange: (tab: TabName) => void;
  projects: Project[];
  onImportJson: () => void;
  onExportJson: () => void;
}

const TABS: { id: TabName; label: string; icon: ReactNode }[] = [
  {
    id: "table", label: "Jobs",
    icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>
  },
  {
    id: "board", label: "Board",
    icon: <><rect x="3" y="3" width="5" height="18" rx="1" /><rect x="10" y="3" width="5" height="12" rx="1" /><rect x="17" y="3" width="5" height="15" rx="1" /></>
  },
  {
    id: "summary", label: "Summary",
    icon: <><path d="M18 20V10M12 20V4M6 20v-6" /></>
  },
  {
    id: "gantt", label: "Timeline",
    icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>
  },
  {
    id: "people", label: "People",
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>
  },
];

const FOOTER_BTNS: { label: string; icon: ReactNode }[] = [
  { label: "Link Excel File", icon: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /> },
  { label: "Import Excel", icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></> },
  { label: "Change Folder", icon: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></> },
  { label: "Open Folder", icon: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><path d="M2 10h20" /></> },
  { label: "Colour Theme", icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 0 0 0 20 4 4 0 0 1 0-8 4 4 0 0 0 0-8" /></> },
];

export default function Sidebar({ currentTab, onTabChange, projects, onImportJson, onExportJson }: Props) {
  return (
    <aside
      className="w-[190px] flex flex-col shrink-0 overflow-y-auto overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #0f1a2e 0%, #162032 100%)" }}
    >
      <div className="py-2 flex-1">
        <span className="block text-[9px] font-extrabold text-white/25 uppercase tracking-[.14em] px-4 pt-3 pb-2">
          Navigation
        </span>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 w-full py-[9px] px-4 border-none text-[13px] font-semibold cursor-pointer transition-all text-left tracking-tight relative ${
              currentTab === tab.id
                ? "text-white bg-white/[.08] border-l-[3px] border-l-[#2563eb]"
                : "text-white/50 border-l-[3px] border-l-transparent hover:text-white/80 hover:bg-white/[.04]"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${currentTab === tab.id ? "opacity-100" : "opacity-60"}`}>
              {tab.icon}
            </svg>
            {tab.label}
            {tab.id === "table" && (
              <span className={`ml-auto text-[10px] font-bold px-[7px] py-[1px] rounded-full ${
                currentTab === tab.id ? "bg-[rgba(37,99,235,.6)] text-white" : "bg-white/15 text-white/60"
              }`}>
                {projects.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer buttons */}
      <div className="px-2.5 pb-3 pt-2 border-t border-white/[.06] flex flex-col gap-[5px]">
        {FOOTER_BTNS.map((btn, i) => (
          <button
            key={btn.label}
            onClick={() => {
              if (i === 1) onImportJson();
              if (i === 2) onExportJson();
            }}
            className="flex items-center gap-2 w-full py-[7px] px-3 bg-white/[.05] border border-white/[.08] text-white/50 text-[11px] font-semibold cursor-pointer rounded-lg transition-all hover:bg-white/[.1] hover:text-white/80 hover:border-white/[.15] text-left"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
              {btn.icon}
            </svg>
            {btn.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
