"use client";

interface Props {
  projectCount: number;
  onNewProject: () => void;
  onManageContacts: () => void;
}

export default function Header({ projectCount, onNewProject, onManageContacts }: Props) {
  return (
    <header
      className="flex items-center gap-4 h-[56px] px-6 shrink-0 relative z-10"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,.2), 0 1px 3px rgba(0,0,0,.15)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", boxShadow: "0 2px 8px rgba(59,130,246,.4)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-[13px] font-bold text-white/90 tracking-tight leading-none">
            Tristar Electrical
          </h1>
          <span className="text-[10px] text-white/40 font-medium">Work Management</span>
        </div>
      </div>

      <div className="w-px h-7 bg-white/10 mx-1" />

      <div className="flex-1" />

      {/* Stats chip */}
      <div className="flex items-center gap-1.5 bg-white/[.06] border border-white/[.08] rounded-full py-1 px-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-white/50 font-semibold">
          {projectCount} Projects
        </span>
      </div>

      {/* Contacts button */}
      <button
        onClick={onManageContacts}
        className="flex items-center gap-1.5 py-[6px] px-3 bg-white/[.07] border border-white/[.1] text-white/70 rounded-lg text-[12px] font-semibold cursor-pointer hover:bg-white/[.14] hover:text-white hover:border-white/[.2] whitespace-nowrap"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Contacts
      </button>

      {/* New Project button */}
      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 py-[6px] px-4 rounded-lg text-[12px] font-bold cursor-pointer text-white whitespace-nowrap hover:brightness-110 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
          boxShadow: "0 2px 12px rgba(37,99,235,.4), inset 0 1px 0 rgba(255,255,255,.15)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Project
      </button>
    </header>
  );
}
