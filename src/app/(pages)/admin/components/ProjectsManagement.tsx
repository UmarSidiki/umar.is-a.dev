"use client";

import React, { useState } from "react";
import { CreateProjectForm } from "./CreateProjectForm";
import { ManageProjects } from "./ManageProjects";
import { Project, ProjectFormData } from "../types";

interface ProjectsManagementProps {
  formData: ProjectFormData;
  editingProject: Project | null;
  formLoading: boolean;
  onInputChange: (field: keyof ProjectFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  projects: Project[];
  projectsLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

type ProjectsSubTab = "manage" | "create";

export function ProjectsManagement({
  formData,
  editingProject,
  formLoading,
  onInputChange,
  onSubmit,
  onReset,
  projects,
  projectsLoading,
  onEdit,
  onDelete,
}: ProjectsManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<ProjectsSubTab>("manage");

  const subTabs: { id: ProjectsSubTab; label: string; count?: number }[] = [
    { id: "manage", label: "Manage projects", count: projects.length },
    { id: "create", label: editingProject ? "Edit project" : "Create project" },
  ];

  React.useEffect(() => {
    if (editingProject) setActiveSubTab("create");
  }, [editingProject]);

  return (
    <div className="space-y-8">
      <div>
        <span className="label-mono text-ink-soft">Work</span>
        <h2 className="display-lg mt-2 text-foreground">Projects</h2>
      </div>

      <nav aria-label="Project sections" className="border-b border-hairline">
        <ul className="flex gap-1 overflow-x-auto scrollbar-hide">
          {subTabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                aria-current={activeSubTab === tab.id ? "page" : undefined}
                className={`inline-flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors ${
                  activeSubTab === tab.id
                    ? "border-signal text-signal"
                    : "border-transparent text-ink-soft hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="label-mono text-ink-soft">{tab.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeSubTab === "create" && (
        <CreateProjectForm
          formData={formData}
          editingProject={editingProject}
          loading={formLoading}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          onReset={onReset}
        />
      )}

      {activeSubTab === "manage" && (
        <ManageProjects
          projects={projects}
          loading={projectsLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
