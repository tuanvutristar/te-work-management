"use client";

interface Props {
  projectCount: number;
  onNewProject: () => void;
  onManageContacts: () => void;
}

export default function Header({ projectCount, onNewProject, onManageContacts }: Props) {
  return (
    <header className="flex items-center gap-3.5 h-[58px] px-5 shrink-0" style={{ background: "linear-gradient(135deg, #1a2d4a 0%, #1e3f6e 100%)", boxShadow: "0 2px 16px rgba(0,0,0,.24)" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
      <div className="w-px h-[26px] bg-white/10" />
      <h1 className="text-sm font-bold text-white/70 whitespace-nowrap tracking-tight">
        Tristar Electrical
      </h1>
      <div className="flex-1" />
      <span className="text-xs text-white/40 font-semibold whitespace-nowrap">
        {projectCount} Projects
      </span>
      <button
        onClick={onManageContacts}
        className="flex items-center gap-1.5 py-[7px] px-[13px] bg-white/[.09] border border-white/15 text-white/80 rounded-lg text-[13px] font-bold cursor-pointer transition-all hover:bg-white/[.16] hover:border-white/[.28] hover:text-white whitespace-nowrap"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Contacts
      </button>
      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-lg text-[13px] font-bold cursor-pointer transition-all text-white whitespace-nowrap hover:-translate-y-px active:translate-y-0"
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", boxShadow: "0 2px 8px rgba(37,99,235,.3)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Project
      </button>
    </header>
  );
}
