"use client";

import React, { useState } from "react";
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  
  if (!selectedProject) return null;

  // Combine main image with additional images
  const allImages = [
    ...(selectedProject.imageUrl ? [selectedProject.imageUrl] : []),
    ...(selectedProject.images || [])
  ].filter(Boolean);

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextSlideImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevSlideImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={closeProjectModal}
      style={{ overflowY: 'auto' }}
    >
      <div
        className="relative bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex-shrink-0 p-6 border-b border-amber-100/50 dark:border-amber-800/50 flex items-start justify-between bg-gradient-to-r from-amber-50/80 via-white/80 to-amber-100/80 dark:from-amber-900/30 dark:via-neutral-900/80 dark:to-amber-900/30 rounded-t-2xl">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white break-words">
                {selectedProject.title}
              </h2>
              {selectedProject.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 flex-shrink-0">
                  ⭐ Featured
                </span>
              )}
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {selectedProject.category || 'Project'} • {selectedProject.status ? selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1) : 'Active'}
            </p>
          </div>
          <button
            onClick={closeProjectModal}
            className="flex-shrink-0 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors duration-200 p-2 rounded-full bg-amber-50 dark:bg-amber-900/30 shadow-sm hover:bg-amber-100 dark:hover:bg-amber-800/50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Project Images Slideshow */}
          {allImages.length > 0 && (
            <div className="relative">
              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={allImages[currentImageIndex]}
                  alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover cursor-pointer"
                  priority={false}
                  unoptimized={true}
                  onClick={() => openLightbox(currentImageIndex)}
                />
              </div>
              
              {/* Navigation arrows for slideshow */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlideImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlideImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
              
              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-amber-500 scale-105'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-amber-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized={true}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
              {/* Description */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  About This Project
                </h3>
                <div className="space-y-3 text-sm md:text-base">
                  <div 
                    className={`transition-all duration-300 ${
                      isDescriptionExpanded 
                        ? 'max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-neutral-200 dark:scrollbar-track-neutral-700' 
                        : 'max-h-none overflow-hidden'
                    }`}
                  >
                    <p className={`text-neutral-600 dark:text-neutral-400 leading-relaxed break-words ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                      {selectedProject.description}
                    </p>
                    {selectedProject.longDescription && (
                      <p className={`text-neutral-600 dark:text-neutral-400 leading-relaxed break-words mt-3 ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                        {selectedProject.longDescription}
                      </p>
                    )}
                  </div>
                  {(selectedProject.description.length > 150 || (selectedProject.longDescription && selectedProject.longDescription.length > 100)) && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1 mt-2"
                    >
                      {isDescriptionExpanded ? (
                        <>
                          <span>See less</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>See more</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies && selectedProject.technologies.length > 0 ? (
                    selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 md:px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-xs md:text-sm font-medium shadow-sm break-keep"
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
            <div className="space-y-4 md:space-y-6 min-w-0">
              {/* Project Links */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  Links
                </h3>
                <div className="space-y-2">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200 font-medium text-sm break-all"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200 font-medium text-sm break-all"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Project Meta */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300 mb-3">
                  Project Info
                </h3>
                <div className="space-y-2 text-xs md:text-sm">
                  {selectedProject.client && (
                    <div className="break-words">
                      <span className="text-neutral-500 dark:text-neutral-400">Client:</span>
                      <span className="text-neutral-900 dark:text-white ml-2">{selectedProject.client}</span>
                    </div>
                  )}
                  {selectedProject.role && (
                    <div className="break-words">
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

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
          onClick={closeLightbox}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main lightbox image */}
            <div className="relative">
              <Image
                src={allImages[lightboxImageIndex]}
                alt={`${selectedProject.title} - Image ${lightboxImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                unoptimized={true}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Navigation arrows for lightbox */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightboxImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter for lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {lightboxImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectModal;