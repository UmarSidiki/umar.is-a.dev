"use client";

import React, { useState } from "react";
import { CreateProjectForm } from "./CreateProjectForm";
import { ManageProjects } from "./ManageProjects";
import { Project, ProjectFormData } from "../types";

interface ProjectsManagementProps {
  // Project form props
  formData: ProjectFormData;
  editingProject: Project | null;
  formLoading: boolean;
  onInputChange: (field: keyof ProjectFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  
  // Projects management props
  projects: Project[];
  projectsLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

type ProjectsSubTab = "create" | "manage";

export const ProjectsManagement: React.FC<ProjectsManagementProps> = ({
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
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProjectsSubTab>("manage");

  const subTabs = [
    { id: "manage" as ProjectsSubTab, label: "Manage Projects", icon: "🗂️", count: projects.length },
    { id: "create" as ProjectsSubTab, label: editingProject ? "Edit Project" : "Create Project", icon: "🚀" },
  ];

  // Auto-switch to create tab when editing
  React.useEffect(() => {
    if (editingProject) {
      setActiveSubTab("create");
    }
  }, [editingProject]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Projects Management
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Showcase your work and manage your project portfolio
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            <span className="text-amber-700 dark:text-amber-300">{projects.length} Projects</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-700 dark:text-green-300">
              {projects.filter(p => p.status === 'active').length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex space-x-8">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSubTab === tab.id
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeSubTab === tab.id
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
        {activeSubTab === "create" && (
          <div className="p-6">
            <CreateProjectForm
              formData={formData}
              editingProject={editingProject}
              loading={formLoading}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              onReset={onReset}
            />
          </div>
        )}

        {activeSubTab === "manage" && (
          <div className="p-6">
            <ManageProjects
              projects={projects}
              loading={projectsLoading}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {activeSubTab === "manage" && (
        <div className="flex justify-center">
          <button
            onClick={() => setActiveSubTab("create")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-lg">🚀</span>
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};
