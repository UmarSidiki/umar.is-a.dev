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

interface ProjectModalProps {
  selectedProject: Project | null;
  closeProjectModal: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  selectedProject,
  closeProjectModal,
}) => {
  if (!selectedProject) return null;
  
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(120deg, rgba(251,191,36,0.1) 0%, rgba(255,255,255,0.8) 100%)', 
        backdropFilter: 'blur(8px)',
        zIndex: 50
      }}
      onClick={closeProjectModal}
    >
      <div
        className="relative bg-white/95 dark:bg-neutral-900/95 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        style={{ boxShadow: '0 8px 32px 0 rgba(251,191,36,0.15), 0 1.5px 8px 0 rgba(0,0,0,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-amber-100/50 dark:border-amber-800/50 flex items-start justify-between bg-gradient-to-r from-amber-50/80 via-white/80 to-amber-100/80 dark:from-amber-900/30 dark:via-neutral-900/80 dark:to-amber-900/30 rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {selectedProject.title}
              </h2>
              {selectedProject.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  ⭐ Featured
                </span>
              )}
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {selectedProject.category || 'Project'} • {selectedProject.status ? selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1) : 'Active'}
            </p>
          </div>
          <button
            onClick={closeProjectModal}
            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors duration-200 p-2 rounded-full bg-amber-50 dark:bg-amber-900/30 shadow-sm hover:bg-amber-100 dark:hover:bg-amber-800/50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Project Image */}
          {selectedProject.imageUrl && (
            <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl overflow-hidden shadow-md">
              <Image
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  About This Project
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {selectedProject.description}
                </p>
                {selectedProject.longDescription && (
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                )}
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies && selectedProject.technologies.length > 0 ? (
                    selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium shadow-sm"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">No technologies specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Project Info Sidebar */}
            <div className="space-y-6">
              {/* Project Links */}
              <div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  Links
                </h3>
                <div className="space-y-2">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Project Meta */}
              <div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  Project Info
                </h3>
                <div className="space-y-2 text-sm">
                  {selectedProject.client && (
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Client:</span>
                      <span className="text-neutral-900 dark:text-white ml-2">{selectedProject.client}</span>
                    </div>
                  )}
                  {selectedProject.role && (
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Role:</span>
                      <span className="text-neutral-900 dark:text-white ml-2">{selectedProject.role}</span>
                    </div>
                  )}
                  {selectedProject.teamSize && (
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Team Size:</span>
                      <span className="text-neutral-900 dark:text-white ml-2">{selectedProject.teamSize} members</span>
                    </div>
                  )}
                  {selectedProject.startDate && (
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Duration:</span>
                      <span className="text-neutral-900 dark:text-white ml-2">
                        {new Date(selectedProject.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {selectedProject.endDate && (
                          <> - {new Date(selectedProject.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
