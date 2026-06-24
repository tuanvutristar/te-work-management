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
      <div className="flex items-center justify-center h-screen bg-[#f0f2f5]">
        <div className="text-[#5a6278] text-sm font-semibold">Loading...</div>
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
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2.5 px-5 py-2.5 bg-[#f0f2f5] shrink-0">
            <div className="relative flex-1 max-w-[280px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9aa0b8] w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="w-full py-2 pr-2.5 pl-8 bg-white border border-[#e0e4ec] rounded-lg text-[#1a1e2e] text-[13px] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,.13)] shadow-[0_1px_3px_rgba(26,30,46,.07)]"
                placeholder="Search jobs, clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="py-2 px-2.5 bg-white border border-[#e0e4ec] rounded-lg text-[#5a6278] text-[13px] outline-none cursor-pointer shadow-[0_1px_3px_rgba(26,30,46,.07)] focus:border-[#2563eb]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              className="py-2 px-2.5 bg-white border border-[#e0e4ec] rounded-lg text-[#5a6278] text-[13px] outline-none cursor-pointer shadow-[0_1px_3px_rgba(26,30,46,.07)] focus:border-[#2563eb]"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="all">All Clients</option>
              {clients.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-xs text-[#9aa0b8] font-semibold ml-auto">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
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
                <PeopleView projects={projects} contacts={contacts} onSelect={setSelectedId} />
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
