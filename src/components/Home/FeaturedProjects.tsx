"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import ProjectModal from "./ProjectModal";
import Reveal from "@/components/motion/Reveal";
import { isFinePointer, prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Project } from "@/types/project";

/** Typographic tile used wherever a project has no artwork — never an empty box. */
function ThumbFallback({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-muted"
    >
      <span className="index-numeral index-hollow text-3xl">
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef({ x: 0, y: 0 });
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotTo = useRef<gsap.QuickToFunc | null>(null);

  const pointerFine = isFinePointer() && !prefersReducedMotion();
  const activeProject =
    active !== null && projects[active]?.imageUrl ? projects[active] : null;

  useGSAP(
    () => {
      const el = previewRef.current;
      if (!el || !pointerFine) return;
      gsap.set(el, { xPercent: -50, yPercent: -50, x: -9999, rotate: 0 });
      xTo.current = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
      yTo.current = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
      rotTo.current = gsap.quickTo(el, "rotate", { duration: 0.8, ease: "power3.out" });
      return () => {
        xTo.current = yTo.current = rotTo.current = null;
        gsap.killTweensOf(el);
      };
    },
    { scope: previewRef }
  );

  const onMove = (e: React.MouseEvent) => {
    if (!pointerFine || !xTo.current) return;
    const dx = e.clientX - lastRef.current.x;
    lastRef.current = { x: e.clientX, y: e.clientY };
    xTo.current(e.clientX);
    yTo.current?.(e.clientY);
    rotTo.current?.(gsap.utils.clamp(-11, 11, dx * 0.8));
  };

  return (
    <section
      id="work"
      className="relative border-t border-hairline"
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
    >
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="label-mono text-ink-soft">03 — Selected work</span>
            <h2 className="display-xl mt-3 text-foreground">Featured projects</h2>
          </div>
          <Link
            href="/projects"
            className="tap label-mono hidden text-foreground transition-colors hover:text-signal lg:inline-flex"
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
              className="tap label-mono mt-6 text-signal"
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
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group grid w-full grid-cols-[5.5rem_1fr_auto] items-center gap-4 border-b border-hairline py-5 text-left transition-colors hover:bg-signal/5 sm:grid-cols-[7rem_1fr_auto] sm:gap-6 sm:py-7 lg:grid-cols-[auto_1fr_auto] lg:gap-8"
              >
                <span className="index-numeral hidden text-2xl text-ink-soft transition-colors group-hover:text-signal lg:block lg:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Touch devices have no hover, so the artwork lives in the row. */}
                <span className="relative col-start-1 row-start-1 aspect-[16/10] w-full overflow-hidden lg:hidden">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 1023px) 28vw, 0px"
                      className="object-cover"
                    />
                  ) : (
                    <ThumbFallback index={i} />
                  )}
                </span>

                <span className="col-start-2 row-start-1 min-w-0 lg:col-start-2">
                  <span className="block font-display text-lg font-bold leading-tight tracking-tight text-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-signal sm:text-3xl">
                    {project.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="label-mono text-ink-soft">{project.category}</span>
                    <span className="hidden text-xs text-ink-soft sm:inline">
                      {project.technologies.slice(0, 3).join(" · ")}
                    </span>
                  </span>
                </span>

                <span className="col-start-3 row-start-1 flex items-center gap-3">
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
          className="tap label-mono mt-10 text-foreground transition-colors hover:text-signal lg:hidden"
        >
          All projects
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Cursor-following artwork reveal — pointer devices only. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[15rem] w-[24rem] max-w-[70vw] overflow-hidden border border-hairline bg-ink shadow-2xl transition-[clip-path] duration-500 ease-out lg:block"
        style={{
          clipPath: activeProject ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        }}
      >
        {activeProject?.imageUrl && (
          <Image
            src={activeProject.imageUrl}
            alt=""
            fill
            sizes="384px"
            className="object-cover"
          />
        )}
      </div>

      <ProjectModal selectedProject={selected} closeProjectModal={() => setSelected(null)} />
    </section>
  );
}
