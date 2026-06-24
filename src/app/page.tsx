"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Project, Contact, TabName, DEPARTMENTS, STATUS_CONFIG, StatusKey } from "@/lib/types";
import { loadProjects, saveProjects, loadContacts, saveContacts, ensurePhaseTasks, totalHrs, taskProgress, createEmptyProject } from "@/lib/store";
import { SAMPLE_PROJECTS } from "@/lib/sample-data";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TableView from "@/components/TableView";
import BoardView from "@/components/BoardView";
import SummaryView from "@/components/SummaryView";
import GanttView from "@/components/GanttView";
import PeopleView from "@/components/PeopleView";
import ProjectPanel from "@/components/ProjectPanel";
import ProjectModal from "@/components/ProjectModal";
import ContactsModal from "@/components/ContactsModal";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentTab, setCurrentTab] = useState<TabName>("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [sortCol, setSortCol] = useState<string>("job");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let p = loadProjects();
    if (p.length === 0) {
      p = SAMPLE_PROJECTS;
      saveProjects(p);
    }
    setProjects(p.map(ensurePhaseTasks));
    setContacts(loadContacts());
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: Project[]) => {
    setProjects(updated);
    saveProjects(updated);
  }, []);

  const updateProject = useCallback((p: Project) => {
    const updated = projects.map((x) => (x.id === p.id ? p : x));
    persist(updated);
  }, [projects, persist]);

  const deleteProject = useCallback((id: string) => {
    persist(projects.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [projects, persist, selectedId]);

  const addProject = useCallback((p: Project) => {
    persist([p, ...projects]);
  }, [projects, persist]);

  const clients = useMemo(() => {
    const c = new Set(projects.map((p) => p.client));
    return Array.from(c).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let f = projects;
    if (statusFilter !== "all") f = f.filter((p) => p.status === statusFilter);
    if (clientFilter !== "all") f = f.filter((p) => p.client === clientFilter);
    if (search) {
      const s = search.toLowerCase();
      f = f.filter(
        (p) =>
          p.job.toLowerCase().includes(s) ||
          p.client.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }
    return f;
  }, [projects, statusFilter, clientFilter, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      switch (sortCol) {
        case "job": va = a.job; vb = b.job; break;
        case "client": va = a.client.toLowerCase(); vb = b.client.toLowerCase(); break;
        case "description": va = a.description.toLowerCase(); vb = b.description.toLowerCase(); break;
        case "status": va = a.status; vb = b.status; break;
        case "hrs": va = totalHrs(a); vb = totalHrs(b); break;
        case "progress": va = taskProgress(a).pct; vb = taskProgress(b).pct; break;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortCol, sortDir]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const selectedProject = projects.find((p) => p.id === selectedId) || null;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f6f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
          <div className="text-[#9ca3af] text-sm font-medium">Loading workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        projectCount={projects.length}
        onNewProject={() => setModalProject(createEmptyProject())}
        onManageContacts={() => setShowContacts(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          projects={projects}
          onImportJson={() => {
            const input = document.createElement("input");
            input.type = "file"; input.accept = ".json";
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) return;
              const text = await file.text();
              try {
                const imported = JSON.parse(text) as Project[];
                if (Array.isArray(imported)) { persist(imported.map(ensurePhaseTasks)); }
              } catch { alert("Invalid JSON file"); }
            };
            input.click();
          }}
          onExportJson={() => {
            const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "projects.json"; a.click();
            URL.revokeObjectURL(url);
          }}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#f4f6f9] border-b border-[#e8eaf0] shrink-0">
            <div className="relative flex-1 max-w-[320px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0b8c9] w-[14px] h-[14px] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="w-full py-2 pr-3 pl-9 bg-white border border-[#dde1ea] rounded-lg text-[#1a1e2e] text-[13px] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)] transition-all placeholder:text-[#b0b8c9]"
                placeholder="Search job #, client, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="py-2 px-3 bg-white border border-[#dde1ea] rounded-lg text-[#5a6278] text-[13px] outline-none cursor-pointer focus:border-[#2563eb] transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              className="py-2 px-3 bg-white border border-[#dde1ea] rounded-lg text-[#5a6278] text-[13px] outline-none cursor-pointer focus:border-[#2563eb] transition-all"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="all">All clients</option>
              {clients.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-[12px] text-[#8892a8] font-semibold ml-auto">
              {filtered.length} jobs
            </span>
          </div>

          {/* Views */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden relative min-w-0">
              {currentTab === "table" && (
                <TableView
                  projects={sorted}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  sortCol={sortCol}
                  sortDir={sortDir}
                  onSort={handleSort}
                  contacts={contacts}
                />
              )}
              {currentTab === "board" && (
                <BoardView
                  projects={filtered}
                  onSelect={setSelectedId}
                  onStatusChange={(id, status) => {
                    const p = projects.find((x) => x.id === id);
                    if (p) updateProject({ ...p, status });
                  }}
                />
              )}
              {currentTab === "summary" && (
                <SummaryView projects={projects} filtered={filtered} onSelect={setSelectedId} />
              )}
              {currentTab === "gantt" && (
                <GanttView projects={filtered} onSelect={setSelectedId} />
              )}
              {currentTab === "people" && (
                <PeopleView projects={projects} contacts={contacts} onSelect={setSelectedId} onManageContacts={() => setShowContacts(true)} />
              )}
            </div>

            {/* Detail panel */}
            {selectedProject && (
              <ProjectPanel
                project={selectedProject}
                contacts={contacts}
                onClose={() => setSelectedId(null)}
                onUpdate={updateProject}
                onEdit={() => setModalProject({ ...selectedProject })}
                onDelete={() => deleteProject(selectedProject.id)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalProject && (
        <ProjectModal
          project={modalProject}
          isNew={!projects.some((p) => p.id === modalProject.id)}
          onSave={(p) => {
            if (projects.some((x) => x.id === p.id)) {
              updateProject(p);
            } else {
              addProject(p);
            }
            setModalProject(null);
          }}
          onClose={() => setModalProject(null)}
          onDelete={() => {
            deleteProject(modalProject.id);
            setModalProject(null);
          }}
        />
      )}
      {showContacts && (
        <ContactsModal
          contacts={contacts}
          onSave={(c) => { setContacts(c); saveContacts(c); }}
          onClose={() => setShowContacts(false)}
        />
      )}
    </div>
  );
}
