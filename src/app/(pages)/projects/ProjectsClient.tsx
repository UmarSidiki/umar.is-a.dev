"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import { ProjectsTemplate } from "@/templates/Projects";
import ProjectModal from "@/components/Home/ProjectModal";
import Reveal from "@/components/motion/Reveal";
import type { Project } from "@/types/project";

const STATUSES = ["all", "active", "completed", "archived"] as const;

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects] = useState<Project[]>(initialProjects || []);
  const [selected, setSelected] = useState<Project | null>(null);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === "all" || project.category === category;
      const matchesStatus = status === "all" || project.status === status;
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.technologies.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [projects, category, status, query]);

  const filtersActive = category !== "all" || status !== "all" || query !== "";

  return (
    <>
      <ProjectsTemplate>
        <span className="label-mono text-ink-soft">Work — Index</span>
        <h1 className="display-xl mt-3 max-w-[16ch] text-foreground">
          Projects &amp; products
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          A selection of web and mobile applications I have designed and built.
        </p>

        <div className="mt-12 flex flex-col gap-4 border-y border-hairline py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="project-search" className="label-mono text-ink-soft">
              Search
            </label>
            <div className="relative flex-1 lg:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
              <input
                id="project-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title or technology"
                className="w-full border border-hairline bg-transparent py-3 pl-10 pr-3 text-base text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="project-category" className="label-mono text-ink-soft">
                Category
              </label>
              <select
                id="project-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-hairline bg-transparent py-3 pl-3 pr-8 text-base text-foreground focus:border-signal focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="project-status" className="label-mono text-ink-soft">
                Status
              </label>
              <select
                id="project-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
                className="border border-hairline bg-transparent py-3 pl-3 pr-8 text-base text-foreground focus:border-signal focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setStatus("all");
                  setQuery("");
                }}
                className="label-mono text-signal transition-opacity hover:opacity-70"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <p className="label-mono mt-5 text-ink-soft" aria-live="polite">
          {filtered.length} of {projects.length} projects
        </p>

        {projects.length === 0 ? (
          <div className="mt-16 border border-dashed border-hairline px-6 py-24 text-center">
            <p className="font-display text-2xl font-bold">No projects yet</p>
            <p className="mt-3 text-sm text-ink-soft">
              Projects will appear here once they are published.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 border border-dashed border-hairline px-6 py-24 text-center">
            <p className="font-display text-2xl font-bold">No matches</p>
            <p className="mt-3 text-sm text-ink-soft">
              Try a different search or clear the filters.
            </p>
          </div>
        ) : (
          <Reveal className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <article key={project._id} className="group bg-background">
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  className="flex h-full w-full flex-col text-left"
                  aria-label={`Open ${project.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-hairline bg-muted">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center label-mono text-ink-soft">
                        {project.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="label-mono text-ink-soft">{project.category}</span>
                      <span className="label-mono text-ink-soft">
                        {new Date(project.createdAt).getFullYear()}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-signal">
                      {project.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                      {project.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-hairline pt-4">
                      <span className="text-xs text-ink-soft">
                        {project.technologies.slice(0, 3).join(" · ")}
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </Reveal>
        )}
      </ProjectsTemplate>

      <ProjectModal selectedProject={selected} closeProjectModal={() => setSelected(null)} />
    </>
  );
}
