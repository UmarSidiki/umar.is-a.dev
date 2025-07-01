"use client";

import React from "react";
import ProjectCard from "./ProjectCard";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: string;
  status: "active" | "completed" | "archived";
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  client?: string;
  teamSize?: number;
  role?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  loading: boolean;
  onProjectClick: (project: Project) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  loading,
  onProjectClick,
}) => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
        Featured Projects
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl p-6 animate-pulse"
            >
              <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-4"></div>
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            </div>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={onProjectClick}
            />
          ))
        ) : (
          // No projects fallback
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              Projects Coming Soon
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              I&apos;m working on some exciting projects. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
