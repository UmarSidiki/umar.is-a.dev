import { Metadata } from "next";
import { generateCompletePageMetadata, generateStructuredData } from "@/lib/seo";
import { getDatabase } from "@/lib/mongodb";
import ProjectsClient from "./ProjectsClient";
import type { Project } from "@/types/project";

export const metadata: Metadata = generateCompletePageMetadata({
  title: "Projects - Umar Siddiqui | Full-Stack Development Portfolio",
  description:
    "Explore my portfolio of web and mobile applications built with React, Next.js, TypeScript and React Native.",
  keywords: [
    "Portfolio Projects",
    "Web Development Portfolio",
    "React Projects",
    "Next.js Applications",
    "Mobile App Development",
    "Full-Stack Projects",
    "Umar Siddiqui Work",
  ],
  url: "/projects",
});

export const dynamic = "force-dynamic";

async function getProjects(): Promise<Project[]> {
  try {
    const db = await getDatabase();
    const docs = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const structuredData = generateStructuredData("website", {
    title: "Projects Portfolio - Umar Siddiqui",
    description: "A portfolio of web and mobile applications built with modern technologies",
    url: "/projects",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProjectsClient initialProjects={projects} />
    </>
  );
}
