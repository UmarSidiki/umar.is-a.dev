import { BaseTemplate } from "@/templates/Home";
import { Metadata } from "next";
import { generateStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Umar Siddiqui's portfolio. Experienced full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies. Available for freelance projects and full-time opportunities.",
  keywords: [
    "Umar Siddiqui",
    "Portfolio",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Expert",
    "TypeScript",
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "Hire Developer",
    "Freelance Developer",
  ],
  openGraph: {
    title: "Umar Siddiqui - Full-Stack Developer Portfolio",
    description:
      "Welcome to my portfolio showcasing innovative web solutions and modern development expertise.",
    type: "website",
    images: [
      {
        url: "/api/og?type=portfolio",
        width: 1200,
        height: 630,
        alt: "Umar Siddiqui Portfolio",
      },
    ],
  },
  twitter: {
    title: "Umar Siddiqui - Full-Stack Developer Portfolio",
    description:
      "Welcome to my portfolio showcasing innovative web solutions and modern development expertise.",
  },
  alternates: {
    canonical: "https://umarsiddiqui.dev",
  },
};

export default function Home() {
  // Generate structured data for person/homepage
  const structuredData = generateStructuredData("person");

  return (
    <BaseTemplate>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Available for new opportunities
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            Building Digital
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
              Experiences
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Full-stack developer passionate about creating innovative web
            solutions that bridge the gap between design and functionality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
              View My Work
            </button>
            <button className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-8 py-3 rounded-xl font-semibold border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200">
              Download Resume
            </button>
          </div>
        </section>

        {/* Skills Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
            Technologies I Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React", icon: "⚛️" },
              { name: "Next.js", icon: "▲" },
              { name: "TypeScript", icon: "📘" },
              { name: "Node.js", icon: "🟢" },
              { name: "Python", icon: "🐍" },
              { name: "Docker", icon: "🐳" },
              { name: "AWS", icon: "☁️" },
              { name: "MongoDB", icon: "🍃" },
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {tech.icon}
                </div>
                <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Projects Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((project) => (
              <div
                key={project}
                className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
              >
                <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-4xl opacity-50">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Project {project}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  A modern web application built with cutting-edge
                  technologies to solve real-world problems.
                </p>
                <div className="flex gap-2 mb-4">
                  {["React", "TypeScript", "Tailwind"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200">
                  View Project →
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </BaseTemplate>
  );
}
