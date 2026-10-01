"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, Github, X } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useLenis } from "@/providers/SmoothScrollProvider";
import type { Project } from "@/types/project";

interface ProjectModalProps {
  selectedProject: Project | null;
  closeProjectModal: () => void;
}

export default function ProjectModal({
  selectedProject,
  closeProjectModal,
}: ProjectModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { lenis } = useLenis();

  const images = selectedProject
    ? [
        ...(selectedProject.imageUrl ? [selectedProject.imageUrl] : []),
        ...(selectedProject.images || []),
      ].filter(Boolean)
    : [];

  useEffect(() => {
    if (!selectedProject) return;
    setExpanded(false);
    setIndex(0);
    setLightbox(false);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(false);
        else closeProjectModal();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      lenis?.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [selectedProject, lightbox, lenis, closeProjectModal]);

  if (!selectedProject) return null;

  const project = selectedProject;
  const hasMore =
    project.description.length > 160 ||
    (project.longDescription?.length ?? 0) > 100;

  const next = () => setIndex((p) => (p + 1) % images.length);
  const prev = () => setIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-[180] flex items-end justify-center bg-foreground/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={closeProjectModal}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden border border-hairline bg-background sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline p-5 sm:p-6">
          <div className="min-w-0">
            <span className="label-mono text-ink-soft">
              {project.category} · {project.status}
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {project.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeProjectModal}
            aria-label="Close project"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline transition-colors hover:border-signal hover:text-signal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {images.length > 0 && (
            <div className="border-b border-hairline p-5 sm:p-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <Image
                  src={images[index]}
                  alt={`${project.title} — image ${index + 1} of ${images.length}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  unoptimized
                  className="cursor-zoom-in object-cover"
                  onClick={() => setLightbox(true)}
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show image ${i + 1}`}
                        aria-current={i === index}
                        className={`relative h-12 w-16 shrink-0 overflow-hidden border transition-colors ${
                          i === index ? "border-signal" : "border-hairline hover:border-foreground"
                        }`}
                      >
                        <Image src={img} alt="" fill sizes="64px" unoptimized className="object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="label-mono text-ink-soft">
                      {index + 1}/{images.length}
                    </span>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous image"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline transition-colors hover:border-signal hover:text-signal"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next image"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline transition-colors hover:border-signal hover:text-signal"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-10 p-5 sm:p-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0">
              <h3 className="label-mono text-ink-soft">About this project</h3>
              <div className="mt-4">
                <p
                  className={`text-sm leading-relaxed text-foreground ${
                    !expanded && hasMore ? "line-clamp-3" : ""
                  }`}
                >
                  {project.description}
                </p>
                {project.longDescription && (
                  <div className={!expanded ? "mt-3 line-clamp-4" : "mt-3"}>
                    <MarkdownRenderer content={project.longDescription} />
                  </div>
                )}
              </div>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="label-mono mt-4 text-signal transition-opacity hover:opacity-70"
                >
                  {expanded ? "See less" : "See more"}
                </button>
              )}

              <h3 className="label-mono mt-10 text-ink-soft">Stack</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.length > 0 ? (
                  project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="border border-hairline px-3 py-1.5 text-xs text-ink-soft"
                    >
                      {tech}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-ink-soft">No technologies listed</li>
                )}
              </ul>
            </div>

            <aside className="space-y-8">
              {(project.liveUrl || project.githubUrl) && (
                <div>
                  <h3 className="label-mono text-ink-soft">Links</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-signal"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Live demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-signal"
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        Source code
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="label-mono text-ink-soft">Details</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {project.client && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Client</dt>
                      <dd className="text-right">{project.client}</dd>
                    </div>
                  )}
                  {project.role && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Role</dt>
                      <dd className="text-right">{project.role}</dd>
                    </div>
                  )}
                  {project.teamSize && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Team</dt>
                      <dd className="text-right">{project.teamSize}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Year</dt>
                    <dd className="text-right">
                      {new Date(project.createdAt).getFullYear()}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[190] flex items-center justify-center bg-black/95 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(false);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(false);
            }}
            aria-label="Close image"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="relative max-h-[90vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[index]}
              alt={`${project.title} — enlarged image ${index + 1}`}
              width={1400}
              height={900}
              unoptimized
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-5 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-5 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
