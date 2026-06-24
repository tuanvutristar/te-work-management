"use client";

import { Project, Contact, DEPARTMENTS, STATUS_CONFIG, StatusKey } from "@/lib/types";
import { useState } from "react";

interface Props {
  projects: Project[];
  contacts: Contact[];
  onSelect: (id: string) => void;
  onManageContacts: () => void;
}

interface PersonData {
  code: string;
  name: string;
  projects: { project: Project; dept: string; hrs: number | null; done: boolean }[];
  totalHrs: number;
  activeCount: number;
}

export default function PeopleView({ projects, contacts, onSelect, onManageContacts }: Props) {
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
        if (!peopleMap.has(code)) peopleMap.set(code, { code, name: contactMap.get(code) || code, projects: [], totalHrs: 0, activeCount: 0 });
        const person = peopleMap.get(code)!;
        person.projects.push({ project: p, dept, hrs: d.hrs, done: phase?.done || false });
        person.totalHrs += d.hrs || 0;
        if (p.status !== "done") person.activeCount++;
      }
    }
  }

  const people = Array.from(peopleMap.values()).sort((a, b) => b.totalHrs - a.totalHrs);
  const selected = selectedPerson ? peopleMap.get(selectedPerson) : null;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-5 py-2.5 shrink-0">
        <button onClick={onManageContacts} className="flex items-center gap-1.5 py-[6px] px-3 bg-white border border-[#dde1ea] rounded-lg text-[12px] font-bold text-[#5a6278] cursor-pointer hover:border-[#2563eb] hover:text-[#2563eb] transition-all">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          Manage People
        </button>
        <button className="flex items-center gap-1.5 py-[6px] px-3 bg-white border border-[#dde1ea] rounded-lg text-[12px] font-bold text-[#5a6278] cursor-pointer hover:border-[#2563eb] hover:text-[#2563eb] transition-all">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Import CSV / Excel
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* People list */}
        <div className="w-[320px] shrink-0 border-r border-[#dde1ea] overflow-y-auto bg-white">
          <div className="sticky top-0 bg-white border-b border-[#dde1ea] py-2.5 px-4 z-10">
            <span className="text-[10px] font-extrabold text-[#8892a8] uppercase tracking-wider">People</span>
          </div>
          {people.map((person) => {
            const isActive = selectedPerson === person.code;
            return (
              <div
                key={person.code}
                className={`flex items-center gap-3 py-2.5 px-4 cursor-pointer transition-all border-b border-[#f0f2f5] ${
                  isActive ? "bg-[#edf2ff] border-l-[3px] border-l-[#2563eb]" : "hover:bg-[#f8f9fc] border-l-[3px] border-l-transparent"
                }`}
                onClick={() => setSelectedPerson(person.code)}
              >
                <div className="w-9 h-9 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm">
                  {person.code.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-[#1a1e2e]">{person.name}</div>
                  <div className="text-[11px] text-[#8892a8] flex items-center gap-1">
                    {person.projects.length} job{person.projects.length !== 1 ? "s" : ""} · {person.totalHrs.toLocaleString()}h
                    {person.activeCount > 0 && <span className="w-[6px] h-[6px] rounded-full bg-[#ef4444] ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
          {people.length === 0 && (
            <div className="py-16 text-center text-[#b0b8c9] text-sm">No people assigned yet</div>
          )}
        </div>

        {/* Person detail */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#f4f6f9]">
          {selected ? (
            <>
              {/* Header card */}
              <div className="bg-white border border-[#dde1ea] rounded-xl p-4 mb-4 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                <div className="w-12 h-12 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-lg font-bold shadow">
                  {selected.code.substring(0, 2)}
                </div>
                <div>
                  <div className="text-[18px] font-bold text-[#1a1e2e]">{selected.name}</div>
                  <div className="text-[12px] text-[#8892a8]">
                    {selected.projects.length} job{selected.projects.length !== 1 ? "s" : ""} · {selected.totalHrs.toLocaleString()} hrs
                    {selected.activeCount > 0 && <span className="w-[6px] h-[6px] rounded-full bg-[#ef4444] inline-block ml-1.5 align-middle" />}
                  </div>
                  <div className="text-[11px] text-[#2563eb] font-semibold mt-0.5">{selected.activeCount} active</div>
                </div>
              </div>

              {/* Job cards */}
              <div className="space-y-2.5">
                {selected.projects.map((item, i) => {
                  const cfg = STATUS_CONFIG[item.project.status as StatusKey];
                  return (
                    <div
                      key={`${item.project.id}-${item.dept}-${i}`}
                      className="bg-white border border-[#dde1ea] rounded-xl py-3 px-4 cursor-pointer hover:border-[#2563eb] hover:shadow-md transition-all"
                      style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}
                      onClick={() => onSelect(item.project.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] text-[#8892a8] font-semibold">Job #{item.project.job}</span>
                            <span className="text-[14px] font-bold text-[#1a1e2e]">{item.project.client}</span>
                          </div>
                          <div className="text-[12px] text-[#5a6278] mb-2">{item.project.description}</div>
                          <span className="text-[10px] font-semibold text-[#8892a8] bg-[#f0f2f5] px-2 py-[2px] rounded">{item.dept} · {item.hrs || 0}h</span>
                        </div>
                        <div className="text-right shrink-0">
                          {item.hrs != null && item.hrs > 0 && (
                            <div className="text-[14px] font-bold text-[#2563eb] tabular-nums">{item.hrs}h</div>
                          )}
                          <span className="text-[10px] font-bold py-[2px] px-2 rounded inline-block mt-1" style={{ color: cfg?.color, background: cfg?.bg, border: `1px solid ${cfg?.border}` }}>
                            {cfg?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#b0b8c9] text-sm">
              Select a person to view their assignments
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
