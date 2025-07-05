import { Metadata } from "next";
import { generateCompletePageMetadata } from "@/lib/seo";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = generateCompletePageMetadata({
  title: "Projects - Umar Siddiqui | Full-Stack Development Portfolio",
  description: "Explore my portfolio of web and mobile applications. See real-world projects built with React, Next.js, TypeScript, Laravel, and Flutter showcasing modern development practices.",
  keywords: ["Portfolio Projects", "Web Development Portfolio", "React Projects", "Next.js Applications", "Mobile App Development", "Full-Stack Projects", "Umar Siddiqui Work"],
  url: '/projects'
});

export default function ProjectsPage() {
  return <ProjectsClient />;
}
