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
        <li key={project._id} className="min-w-0 border border-hairline p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="min-w-0 break-words font-display text-lg font-bold">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="label-mono shrink-0 text-signal">Featured</span>
                )}
              </div>
              <p className="mt-2 line-clamp-3 break-words text-sm text-ink-soft sm:line-clamp-2">
                {project.description}
              </p>
              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                <span className="label-mono break-words text-ink-soft">{project.status}</span>
                <span className="label-mono break-words text-ink-soft">{project.category}</span>
                {project.technologies.length > 0 && (
                  <span className="min-w-0 break-words text-xs text-ink-soft">
                    {project.technologies.slice(0, 3).join(", ")}
                    {project.technologies.length > 3 &&
                      ` +${project.technologies.length - 3} more`}
                  </span>
                )}
              </div>
              <p className="mt-3 break-words text-xs text-ink-soft">
                Created {formatDate(project.createdAt)}
                {project.updatedAt !== project.createdAt &&
                  ` · Updated ${formatDate(project.updatedAt)}`}
              </p>
            </div>

            {/* Full-width 44px actions on touch, inline pair from lg. */}
            <div className="flex min-w-0 items-center gap-2 lg:shrink-0">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="label-mono inline-flex h-11 flex-1 items-center justify-center border border-hairline px-5 transition-colors hover:border-signal hover:text-signal lg:flex-none"
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
                className="label-mono inline-flex h-11 flex-1 items-center justify-center border border-hairline px-5 transition-colors hover:border-destructive hover:text-destructive lg:flex-none"
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
