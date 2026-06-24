"use client";

interface Props {
  projectCount: number;
  onNewProject: () => void;
  onManageContacts: () => void;
}

export default function Header({ projectCount, onNewProject }: Props) {
  return (
    <header
      className="flex items-center gap-4 h-[52px] px-5 shrink-0 relative z-10"
      style={{
        background: "linear-gradient(135deg, #0f1a2e 0%, #1a2d4a 50%, #1e3f6e 100%)",
        boxShadow: "0 2px 16px rgba(0,0,0,.24)",
      }}
    >
      {/* Logo */}
      <div className="flex items-baseline gap-0.5 select-none">
        <span className="text-[22px] font-black italic tracking-tight" style={{ color: "#d4a843", textShadow: "0 1px 4px rgba(212,168,67,.3)" }}>
          TRISTAR
        </span>
        <span className="text-[8px] font-bold uppercase tracking-[.15em] text-[#d4a843]/60 ml-0.5 self-end mb-[3px]">
          ELECTRICAL
        </span>
      </div>

      <div className="w-px h-6 bg-white/15 mx-1" />

      <span className="text-[14px] font-bold text-white/80 tracking-tight">
        Project Manager
      </span>

      <div className="flex-1" />

      <span className="text-[13px] text-white/40 font-semibold mr-2">
        {projectCount} jobs
      </span>

      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 py-[6px] px-4 rounded-lg text-[13px] font-bold cursor-pointer text-white whitespace-nowrap hover:brightness-110 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          boxShadow: "0 2px 8px rgba(37,99,235,.35)",
        }}
      >
        <span className="text-[15px] leading-none">+</span>
        New Job
      </button>
    </header>
  );
}
