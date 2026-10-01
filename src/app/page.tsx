import React from "react";
import { BaseTemplate } from "@/templates/Home";
import { generateStructuredData } from "@/lib/seo";
import {
  Hero,
  Statement,
  ServicesTrack,
  FeaturedProjects,
  TechStack,
  AboutSection,
  ContactCTA,
} from "@/components/Home";
import { getDatabase } from "@/lib/mongodb";
import type { Project } from "@/types/project";

export const dynamic = "force-dynamic";

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection("projects");
    let docs = await collection
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();
    if (docs.length === 0) {
      docs = await collection.find({}).sort({ createdAt: -1 }).limit(4).toArray();
    }
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getFeaturedProjects();
  const structuredData = generateStructuredData("person");

  return (
    <BaseTemplate>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <ServicesTrack />
      <FeaturedProjects projects={projects} />
      <TechStack />
      <AboutSection />
      <ContactCTA />
    </BaseTemplate>
  );
}
