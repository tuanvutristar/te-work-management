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
          peopleMap.set(code, {
            code,
            name: contactMap.get(code) || code,
            projects: [],
            totalHrs: 0,
            activeCount: 0,
          });
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
    <div className="absolute inset-0 flex overflow-hidden">
      {/* People list */}
      <div className="w-[320px] shrink-0 border-r border-[#e0e4ec] overflow-y-auto bg-white">
        <div className="sticky top-0 bg-[#f6f7fa] border-b border-[#e0e4ec] py-2.5 px-4">
          <span className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider">
            Team Members ({people.length})
          </span>
        </div>
        {people.map((person) => (
          <div
            key={person.code}
            className={`flex items-center gap-3 py-2.5 px-4 border-b border-[#e0e4ec] cursor-pointer transition-colors ${
              selectedPerson === person.code ? "bg-[#eff6ff] shadow-[inset_3px_0_0_#2563eb]" : "hover:bg-[#f6f7fa]"
            }`}
            onClick={() => setSelectedPerson(person.code)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {person.code.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#1a1e2e] truncate">{person.name}</div>
              <div className="text-[11px] text-[#9aa0b8]">
                {person.activeCount} active · {person.totalHrs.toLocaleString()}h
              </div>
            </div>
          </div>
        ))}
        {people.length === 0 && (
          <div className="py-12 text-center text-[#9aa0b8] text-sm">
            No people assigned to projects yet
          </div>
        )}
      </div>

      {/* Person detail */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#f0f2f5]">
        {selected ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-lg font-bold">
                {selected.code.substring(0, 2)}
              </div>
              <div>
                <div className="text-lg font-bold text-[#1a1e2e]">{selected.name}</div>
                <div className="text-sm text-[#5a6278]">
                  Code: {selected.code} · {selected.projects.length} assignments · {selected.totalHrs.toLocaleString()} total hours
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e0e4ec] rounded-xl shadow-[0_1px_3px_rgba(26,30,46,.07)] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f6f7fa] border-b border-[#e0e4ec]">
                    <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2 px-3 text-left">Job</th>
                    <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2 px-3 text-left">Client</th>
                    <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2 px-3 text-left">Department</th>
                    <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2 px-3 text-left">Hours</th>
                    <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2 px-3 text-left">Status</th>
                    <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-2 px-3 text-left">Phase</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.projects.map((item, i) => {
                    const cfg = STATUS_CONFIG[item.project.status as StatusKey];
                    return (
                      <tr
                        key={`${item.project.id}-${item.dept}-${i}`}
                        className="border-b border-[#e0e4ec] last:border-b-0 cursor-pointer hover:bg-[#eff6ff] transition-colors"
                        onClick={() => onSelect(item.project.id)}
                      >
                        <td className="py-2 px-3 text-[12px] font-bold text-[#9aa0b8]">#{item.project.job}</td>
                        <td className="py-2 px-3 text-[13px] font-bold text-[#1a1e2e]">{item.project.client}</td>
                        <td className="py-2 px-3 text-[12px] text-[#5a6278]">{item.dept}</td>
                        <td className="py-2 px-3 text-[12px] text-[#5a6278] font-semibold">{item.hrs || "—"}</td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] font-bold py-[2px] px-2 rounded-full border" style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
                            {cfg?.label}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {item.done ? (
                            <span className="text-[10px] font-bold text-[#16a34a]">Complete</span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#d97706]">In Progress</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#9aa0b8] text-sm">
            Select a person to view their assignments
          </div>
        )}
      </div>
    </div>
  );
}
