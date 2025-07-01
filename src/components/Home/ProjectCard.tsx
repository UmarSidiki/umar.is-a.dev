"use client";

import React from "react";
import Image from "next/image";

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

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1 cursor-pointer"
    >
      <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={400}
            height={300}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-4xl opacity-50">🚀</span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
        {project.title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
        {project.description}
      </p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {project.technologies.slice(0, 3).map((tech: string) => (
          <span
            key={tech}
            className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full text-sm">
            +{project.technologies.length - 3} more
          </span>
        )}
      </div>
      <button className="text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200">
        View Project →
      </button>
    </div>
  );
};

export default ProjectCard;
