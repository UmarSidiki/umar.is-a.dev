"use client";

import React from "react";
import { Project } from "../types";

interface ManageProjectsProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function ManageProjects({ projects, loading, onEdit, onDelete }: ManageProjectsProps) {
  if (loading) {
    return <p className="py-12 text-center text-sm text-ink-soft">Loading projects…</p>;
  }

  if (projects.length === 0) {
    return (
      <div className="border border-dashed border-hairline px-6 py-16 text-center">
        <p className="font-display text-xl font-bold">No projects yet</p>
        <p className="mt-2 text-sm text-ink-soft">Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {projects.map((project) => (
        <li key={project._id} className="border border-hairline p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-bold">{project.title}</h3>
                {project.featured && (
                  <span className="label-mono text-signal">Featured</span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{project.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="label-mono text-ink-soft">{project.status}</span>
                <span className="label-mono text-ink-soft">{project.category}</span>
                {project.technologies.length > 0 && (
                  <span className="text-xs text-ink-soft">
                    {project.technologies.slice(0, 3).join(", ")}
                    {project.technologies.length > 3 &&
                      ` +${project.technologies.length - 3} more`}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-ink-soft">
                Created {formatDate(project.createdAt)}
                {project.updatedAt !== project.createdAt &&
                  ` · Updated ${formatDate(project.updatedAt)}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="label-mono inline-flex h-11 items-center border border-hairline px-5 transition-colors hover:border-signal hover:text-signal"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this project? This cannot be undone.")) {
                    onDelete(project._id);
                  }
                }}
                className="label-mono inline-flex h-11 items-center border border-hairline px-5 transition-colors hover:border-destructive hover:text-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
