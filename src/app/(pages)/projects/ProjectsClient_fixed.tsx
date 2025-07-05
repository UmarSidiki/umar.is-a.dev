"use client";

import React, { useState, useEffect } from "react";
import { ProjectsTemplate } from "@/templates/Projects";
import { generateStructuredData } from "@/lib/seo";
import { ProjectModal } from "@/components/Home";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  slug?: string;
}

const ProjectsClient = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const result = await response.json();
        
        if (result.success) {
          setProjects(result.data || []);
        } else {
          setError(result.error || 'Failed to load projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get unique categories and statuses for filters
  const categories = ["all", ...new Set(projects.map(p => p.category))];
  const statuses = ["all", "active", "completed", "archived"];

  // Filter projects based on selected filters
  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
    const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = "unset";
  };

  // Generate structured data for projects
  const projectsStructuredData = generateStructuredData("website", {
    title: "Projects Portfolio - Umar Siddiqui",
    description: "Explore my portfolio of web and mobile applications built with modern technologies",
    url: "/projects"
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300';
    }
  };

  return (
    <>
      <ProjectsTemplate>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
        />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Subtle animated background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/3 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm mb-12 opacity-70" aria-label="Breadcrumb">
              <Link 
                href="/" 
                className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-neutral-900 dark:text-white font-medium">Portfolio</span>
            </nav>

            {/* Hero Content */}
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/30 dark:border-amber-700/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                Portfolio Showcase
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                <span className="bg-gradient-to-r from-neutral-900 via-amber-600 to-neutral-900 dark:from-white dark:via-amber-400 dark:to-white bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
                Crafting digital experiences through innovative design and cutting-edge technology
              </p>

              {/* Interactive Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-12">
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                    {projects.length}+
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    Projects
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                    {categories.length - 1}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    Categories
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                    {projects.filter(p => p.status === 'active').length}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters Section */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16">
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200/40 dark:border-neutral-700/40 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                {/* Category Filter */}
                <div className="flex flex-col gap-4 min-w-0 flex-1">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide uppercase">
                    Filter by Category
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-sm",
                          selectedCategory === category
                            ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25 scale-105'
                            : 'bg-white/70 dark:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 border-neutral-200/50 dark:border-neutral-600/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 hover:scale-105 hover:shadow-md'
                        )}
                      >
                        {category === 'all' ? 'All Projects' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-4 min-w-0 flex-1">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide uppercase">
                    Filter by Status
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-sm",
                          selectedStatus === status
                            ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25 scale-105'
                            : 'bg-white/70 dark:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 border-neutral-200/50 dark:border-neutral-600/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 hover:scale-105 hover:shadow-md'
                        )}
                      >
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              {!loading && !error && (
                <div className="mt-8 pt-6 border-t border-neutral-200/30 dark:border-neutral-700/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                      {filteredProjects.length === 0 
                        ? 'No projects match your criteria'
                        : `Showing ${filteredProjects.length} of ${projects.length} project${filteredProjects.length !== 1 ? 's' : ''}`
                      }
                    </span>
                    {selectedCategory !== 'all' || selectedStatus !== 'all' ? (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedStatus('all');
                        }}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Filters
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced Loading State */}
        {loading && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200/30 border-t-amber-500"></div>
                <div className="absolute inset-0 rounded-full bg-amber-100/10 dark:bg-amber-900/10 animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Loading projects...</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
                Preparing an amazing showcase for you
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Error State */}
        {error && !loading && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center py-24">
              <div className="mb-8">
                <div className="relative inline-flex">
                  <svg className="w-24 h-24 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 00-16 0 7.962 7.962 0 011.678 4.291" />
                  </svg>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Unable to Load Projects
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md text-center">
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Projects Grid */}
        {!loading && !error && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-24">
                <div className="mb-8">
                  <svg className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  No projects found
                </h3>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                  Try adjusting your filters or check back later for new projects.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="group relative bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-700/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] cursor-pointer"
                    onClick={() => openProjectModal(project)}
                  >
                    {/* Project Image */}
                    <div className="relative h-56 overflow-hidden">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-amber-900/40 dark:via-amber-800/30 dark:to-amber-900/50 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-20 h-20 text-amber-400 dark:text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Project Preview</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getStatusColor(project.status)} shadow-lg`}>
                          {project.status}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm border border-amber-400">
                            ⭐ Featured
                          </span>
                        </div>
                      )}

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full p-3 shadow-xl">
                          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 lg:p-8">
                      {/* Category */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                          {project.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-neutral-100/80 dark:bg-neutral-700/80 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium border border-neutral-200/50 dark:border-neutral-600/50 backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-3 py-1.5 bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Footer with Links and Date */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
                        <div className="flex items-center gap-4">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="group/link flex items-center justify-center w-10 h-10 bg-neutral-100 dark:bg-neutral-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View on GitHub"
                            >
                              <svg className="w-5 h-5 group-hover/link:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="group/link flex items-center justify-center w-10 h-10 bg-neutral-100 dark:bg-neutral-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Live Demo"
                            >
                              <svg className="w-5 h-5 group-hover/link:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            {formatDate(project.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Call-to-Action Section */}
        <div className="mt-16 lg:mt-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16">
            <div className="bg-gradient-to-br from-amber-50/50 via-white/30 to-amber-50/50 dark:from-neutral-800/50 dark:via-neutral-900/30 dark:to-neutral-800/50 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl p-8 lg:p-12 shadow-lg text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  Interested in Working Together?
                </h3>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  I&apos;m always excited to collaborate on new projects and bring innovative ideas to life. 
                  Let&apos;s discuss how we can create something amazing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get In Touch
                  </Link>
                  <Link 
                    href="/"
                    className="inline-flex items-center px-8 py-4 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProjectsTemplate>

      {/* Project Detail Modal - Outside ProjectsTemplate for proper viewport centering */}
      <ProjectModal
        selectedProject={selectedProject}
        closeProjectModal={closeProjectModal}
      />
    </>
  );
};

export default ProjectsClient;
