"use client";

import React, { useState, useEffect } from "react";
import { BaseTemplate } from "@/templates/Home";
import { generateStructuredData } from "@/lib/seo";
import { ProjectModal, ProjectsSection, WhatIDo, TechnologyIcons, DynamicHeadline } from "@/components/Home";
import { services, user } from "@/providers/user";
import Link from "next/link";

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch latest projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?limit=4&featured=true");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched projects:", data.data); // Debug log
          setProjects(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openProjectModal = (project: Project) => {
    console.log("Opening modal for project:", project);
    setSelectedProject(project);
    console.log("Selected project set to:", project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        closeProjectModal();
      }
    };

    if (selectedProject) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  // Generate structured data for person/homepage
  const structuredData = generateStructuredData("person");

  return (
    <>
      <BaseTemplate>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            {user.homepage.availability.showStatus && (
              <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                {user.homepage.availability.status}
              </div>
            )}

            <DynamicHeadline />

            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {user.homepage.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/projects"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-center"
              >
                {user.homepage.callToAction.primary}
              </Link>
              <button
                className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-8 py-3 rounded-xl font-semibold border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200"
                onClick={() => window.open(user.Resume, "_blank")}
              >
                {user.homepage.callToAction.secondary}
              </button>
            </div>
          </section>

          {/* What I Do Section */}
          <WhatIDo
            services={services}
            title="What I Do"
            subtitle="I offer a range of services to help bring your digital vision to life"
            onRequestMore={() => window.open('mailto:' + user.email + '?subject=Service Inquiry', '_blank')}
          />

          {/* Skills Preview */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Technologies I Work With
            </h2>
            <TechnologyIcons technologies={user.technologies} />
          </section>

          {/* Recent Projects Preview */}
          <ProjectsSection
            projects={projects}
            loading={loading}
            onProjectClick={openProjectModal}
          />
        </div>
      </BaseTemplate>

      {/* Project Detail Modal - Outside BaseTemplate for proper viewport centering */}
      <ProjectModal
        selectedProject={selectedProject}
        closeProjectModal={closeProjectModal}
      />
    </>
  );
}
