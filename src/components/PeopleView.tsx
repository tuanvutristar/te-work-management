"use client";

import { Project, Contact, DEPARTMENTS, STATUS_CONFIG, StatusKey } from "@/lib/types";
import { useState } from "react";

interface Props {
  projects: Project[];
  contacts: Contact[];
  onSelect: (id: string) => void;
}

interface PersonData {
  code: string;
  name: string;
  projects: { project: Project; dept: string; hrs: number | null; done: boolean }[];
  totalHrs: number;
  activeCount: number;
}

const AVATAR_COLORS = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
  "from-indigo-500 to-indigo-600",
  "from-pink-500 to-pink-600",
];

export default function PeopleView({ projects, contacts, onSelect }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const contactMap = new Map<string, string>();
  for (const c of contacts) contactMap.set(c.id, c.name);

  const peopleMap = new Map<string, PersonData>();

  for (const p of projects) {
    for (const dept of DEPARTMENTS) {
      const d = p.departments[dept];
      const phase = p.phaseTasks?.[dept];
      if (!d?.pm) continue;
      const codes = d.pm.split("/").map((c) => c.trim()).filter(Boolean);
      for (const code of codes) {
        if (!peopleMap.has(code)) {
          peopleMap.set(code, { code, name: contactMap.get(code) || code, projects: [], totalHrs: 0, activeCount: 0 });
        }
        const person = peopleMap.get(code)!;
        person.projects.push({ project: p, dept, hrs: d.hrs, done: phase?.done || false });
        person.totalHrs += d.hrs || 0;
        if (p.status !== "done") person.activeCount++;
      }
    }
  }

  const people = Array.from(peopleMap.values()).sort((a, b) => b.activeCount - a.activeCount);
  const selected = selectedPerson ? peopleMap.get(selectedPerson) : null;

  return (
    <div className="absolute inset-0 flex overflow-hidden animate-fade-in">
      {/* People list */}
      <div className="w-[300px] shrink-0 border-r border-[#e5e7eb] overflow-y-auto bg-white">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#e5e7eb] py-3 px-4">
          <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">
            Team Members
          </div>
          <div className="text-[20px] font-extrabold text-[#111827] -mt-0.5">{people.length}</div>
        </div>
        <div className="py-1">
          {people.map((person, i) => {
            const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const isActive = selectedPerson === person.code;
            return (
              <div
                key={person.code}
                className={`flex items-center gap-3 py-2.5 px-4 cursor-pointer transition-all relative ${
                  isActive
                    ? "bg-blue-50/80"
                    : "hover:bg-[#f8fafc]"
                }`}
                onClick={() => setSelectedPerson(person.code)}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-blue-500 to-indigo-500" />}
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}>
                  {person.code.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#111827] truncate">{person.name}</div>
                  <div className="text-[11px] text-[#9ca3af] flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      {person.activeCount} active
                    </span>
                    <span className="text-[#d1d5db]">·</span>
                    <span>{person.totalHrs.toLocaleString()}h</span>
                  </div>
                </div>
              </div>
            );
          })}
          {people.length === 0 && (
            <div className="py-16 text-center text-[#d1d5db] text-sm font-medium px-4">
              No people assigned yet
            </div>
          )}
        </div>
      </div>

      {/* Person detail */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#f4f6f9]">
        {selected ? (
          <div className="animate-fade-in">
            {/* Person header card */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 mb-4 card-hover">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[people.indexOf(selected) % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {selected.code.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-[#111827]">{selected.name}</div>
                  <div className="text-sm text-[#6b7280] mt-0.5">Code: <span className="font-mono font-semibold bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#374151]">{selected.code}</span></div>
                </div>
                <div className="flex gap-3">
                  {[
                    { label: "Assignments", val: selected.projects.length, color: "#3b82f6" },
                    { label: "Active", val: selected.activeCount, color: "#7c3aed" },
                    { label: "Hours", val: selected.totalHrs.toLocaleString(), color: "#6366f1" },
                  ].map((s) => (
                    <div key={s.label} className="text-center px-4 py-2 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                      <div className="text-[18px] font-extrabold tabular-nums" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignments table */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                    {["Job", "Client", "Department", "Hours", "Status", "Phase"].map((h) => (
                      <th key={h} className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider py-2.5 px-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selected.projects.map((item, i) => {
                    const cfg = STATUS_CONFIG[item.project.status as StatusKey];
                    return (
                      <tr
                        key={`${item.project.id}-${item.dept}-${i}`}
                        className={`border-b border-[#f3f4f6] last:border-b-0 cursor-pointer hover:bg-blue-50/40 transition-colors group ${
                          i % 2 === 1 ? "bg-[#fafbfc]" : ""
                        }`}
                        onClick={() => onSelect(item.project.id)}
                      >
                        <td className="py-2.5 px-4"><span className="text-[11px] font-mono font-bold text-[#94a3b8] bg-[#f1f5f9] px-1.5 py-0.5 rounded">#{item.project.job}</span></td>
                        <td className="py-2.5 px-4 text-[13px] font-semibold text-[#111827] group-hover:text-[#2563eb] transition-colors">{item.project.client}</td>
                        <td className="py-2.5 px-4 text-[12px] text-[#6b7280]">{item.dept}</td>
                        <td className="py-2.5 px-4 text-[12px] text-[#6b7280] font-medium tabular-nums">{item.hrs || <span className="text-[#d1d5db]">—</span>}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold py-[3px] px-2 rounded-full border" style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
                            <span className="w-[4px] h-[4px] rounded-full" style={{ background: cfg?.color }} />
                            {cfg?.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          {item.done ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-[3px] rounded-full">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                              Complete
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-[3px] rounded-full">In Progress</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#d1d5db]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-3 opacity-40">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-sm font-medium">Select a person to view details</span>
          </div>
        )}
      </div>
    </div>
  );
}
