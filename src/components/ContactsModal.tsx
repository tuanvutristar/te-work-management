"use client";

import { useState } from "react";
import { Contact } from "@/lib/types";

interface Props {
  contacts: Contact[];
  onSave: (contacts: Contact[]) => void;
  onClose: () => void;
}

export default function ContactsModal({ contacts: initial, onSave, onClose }: Props) {
  const [list, setList] = useState<Contact[]>([...initial]);

  function addRow() {
    setList([...list, { id: "", name: "" }]);
  }

  function updateRow(i: number, field: "id" | "name", val: string) {
    const updated = [...list];
    updated[i] = { ...updated[i], [field]: val };
    setList(updated);
  }

  function deleteRow(i: number) {
    setList(list.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    const valid = list.filter((c) => c.id.trim() && c.name.trim());
    onSave(valid);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-[0_14px_44px_rgba(26,30,46,.18)] w-[500px] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between py-4 px-5 border-b border-[#e0e4ec] shrink-0">
          <div>
            <div className="text-[16px] font-bold text-[#1a1e2e]">People Database</div>
            <div className="text-[12px] text-[#9aa0b8]">Map codes / initials to full names</div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9aa0b8] hover:text-[#dc2626] rounded-lg transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <table className="w-full border-collapse mb-2">
            <thead>
              <tr className="border-b-2 border-[#e0e4ec]">
                <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1.5 pr-2 text-left w-[100px]">Code</th>
                <th className="text-[10px] font-extrabold text-[#9aa0b8] uppercase tracking-wider py-1.5 pr-2 text-left">Full Name</th>
                <th className="w-[30px]"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, i) => (
                <tr key={i} className="border-b border-[#e0e4ec] last:border-b-0">
                  <td className="py-1.5 pr-2">
                    <input
                      className="w-full py-1 px-2 bg-[#f6f7fa] border border-[#e0e4ec] rounded text-[12px] outline-none focus:border-[#2563eb]"
                      value={c.id}
                      onChange={(e) => updateRow(i, "id", e.target.value)}
                      placeholder="e.g. JL"
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      className="w-full py-1 px-2 bg-[#f6f7fa] border border-[#e0e4ec] rounded text-[12px] outline-none focus:border-[#2563eb]"
                      value={c.name}
                      onChange={(e) => updateRow(i, "name", e.target.value)}
                      placeholder="Full name"
                    />
                  </td>
                  <td className="py-1.5">
                    <button
                      onClick={() => deleteRow(i)}
                      className="text-[#9aa0b8] hover:text-[#dc2626] text-sm cursor-pointer"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addRow}
            className="text-[12px] font-bold text-[#2563eb] hover:text-[#1d4ed8] cursor-pointer"
          >
            + Add Contact
          </button>
        </div>

        <div className="flex items-center gap-2 py-3.5 px-5 border-t border-[#e0e4ec] shrink-0 bg-[#f6f7fa]">
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="py-2 px-4 text-[12px] font-bold text-[#5a6278] bg-white border border-[#e0e4ec] rounded-lg cursor-pointer hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-5 text-[12px] font-bold text-white rounded-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
          >
            Save Contacts
          </button>
        </div>
      </div>
    </div>
  );
}
