"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectModal from "./ProjectModal";
import Reveal from "@/components/motion/Reveal";
import type { Project } from "@/types/project";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="work" className="border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="label-mono text-ink-soft">03 — Selected work</span>
            <h2 className="display-xl mt-3 text-foreground">Featured projects</h2>
          </div>
          <Link
            href="/projects"
            className="label-mono hidden items-center gap-1 text-foreground transition-colors hover:text-signal sm:inline-flex"
          >
            All projects
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-16 border border-dashed border-hairline px-6 py-20 text-center">
            <p className="font-display text-2xl font-bold">Projects coming soon</p>
            <p className="mt-3 text-sm text-ink-soft">
              New work is on the way. In the meantime, get in touch.
            </p>
            <Link
              href="/contact"
              className="label-mono mt-6 inline-flex items-center gap-1 text-signal"
            >
              Contact
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <Reveal className="mt-12 border-t border-hairline">
            {projects.map((project, i) => (
              <button
                key={project._id}
                type="button"
                onClick={() => setSelected(project)}
                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-hairline py-7 text-left transition-colors hover:bg-signal/5 sm:gap-8"
              >
                <span className="index-numeral text-2xl text-ink-soft transition-colors group-hover:text-signal sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="block font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-signal sm:text-3xl">
                    {project.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="label-mono text-ink-soft">{project.category}</span>
                    <span className="hidden text-xs text-ink-soft sm:inline">
                      {project.technologies.slice(0, 3).join(" · ")}
                    </span>
                  </span>
                </span>

                <span className="flex items-center gap-3">
                  <span className="label-mono hidden text-ink-soft sm:inline">
                    {new Date(project.createdAt).getFullYear()}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                    aria-hidden="true"
                  />
                </span>
              </button>
            ))}
          </Reveal>
        )}

        <Link
          href="/projects"
          className="label-mono mt-10 inline-flex items-center gap-1 text-foreground transition-colors hover:text-signal sm:hidden"
        >
          All projects
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ProjectModal selectedProject={selected} closeProjectModal={() => setSelected(null)} />
    </section>
  );
}
