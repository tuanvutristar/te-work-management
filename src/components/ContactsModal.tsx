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

  function addRow() { setList([...list, { id: "", name: "" }]); }
  function updateRow(i: number, field: "id" | "name", val: string) {
    const updated = [...list]; updated[i] = { ...updated[i], [field]: val }; setList(updated);
  }
  function deleteRow(i: number) { setList(list.filter((_, idx) => idx !== i)); }
  function handleSave() { onSave(list.filter((c) => c.id.trim() && c.name.trim())); onClose(); }

  const inputClass = "w-full py-1.5 px-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg text-[12px] outline-none focus:border-[#3b82f6] focus:bg-white transition-all placeholder:text-[#d1d5db]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-backdrop" style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-[520px] max-h-[80vh] flex flex-col overflow-hidden animate-modal"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,.2), 0 4px 16px rgba(0,0,0,.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between py-5 px-6 border-b border-[#f3f4f6] shrink-0">
          <div>
            <div className="text-[18px] font-bold text-[#111827]">People Database</div>
            <div className="text-[12px] text-[#9ca3af] mt-0.5">Map codes to full names — used across all jobs</div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50 rounded-xl transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl overflow-hidden mb-3">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider py-2.5 px-4 text-left w-[110px]">Code</th>
                  <th className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider py-2.5 px-3 text-left">Full Name</th>
                  <th className="w-[36px]"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((c, i) => (
                  <tr key={i} className="border-b border-[#f3f4f6] last:border-b-0 bg-white">
                    <td className="py-2 px-4">
                      <input className={inputClass} value={c.id} onChange={(e) => updateRow(i, "id", e.target.value)} placeholder="e.g. JL" />
                    </td>
                    <td className="py-2 px-3">
                      <input className={inputClass} value={c.name} onChange={(e) => updateRow(i, "name", e.target.value)} placeholder="Full name" />
                    </td>
                    <td className="py-2 px-2">
                      <button onClick={() => deleteRow(i)} className="w-6 h-6 flex items-center justify-center text-[#d1d5db] hover:text-[#ef4444] hover:bg-red-50 rounded-lg cursor-pointer transition-all text-sm">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addRow} className="text-[12px] font-bold text-[#3b82f6] hover:text-[#1d4ed8] cursor-pointer flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Contact
          </button>
        </div>

        <div className="flex items-center gap-2 py-4 px-6 border-t border-[#f3f4f6] shrink-0 bg-[#f9fafb]">
          <div className="flex-1" />
          <button onClick={onClose} className="py-2 px-5 text-[12px] font-bold text-[#6b7280] bg-white border border-[#e5e7eb] rounded-xl cursor-pointer hover:bg-[#f8fafc] transition-all">Cancel</button>
          <button onClick={handleSave} className="py-2 px-6 text-[12px] font-bold text-white rounded-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", boxShadow: "0 2px 8px rgba(37,99,235,.25)" }}>
            Save Contacts
          </button>
        </div>
      </div>
    </div>
  );
}
