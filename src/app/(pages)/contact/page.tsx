import { Metadata } from "next";
import { generatePageMetadata, generateStructuredData } from "@/lib/seo";
import ContactClient from "./ContactClient";
import { user } from "@/providers/user";

export const metadata: Metadata = generatePageMetadata({
  title: `Contact - ${user.contact.formTitle}`,
  description:
    `Ready to start your next project? Get in touch with ${user.name}, an experienced ${user.title}. Available for freelance projects, consultations, and full-time opportunities.`,
  keywords: [
    "Contact Developer",
    "Hire Full-Stack Developer",
    "React Developer for Hire",
    "Next.js Consultant",
    "Web Development Services",
    "Freelance Developer",
    "Project Consultation",
    "Custom Web Development",
    "Software Development Services",
    "Technical Consulting",
  ],
  url: "/contact",
});

export default function ContactPage() {
  // Generate structured data for contact page
  const structuredData = generateStructuredData("contact");

  return (
    <>
      {/* JSON-LD Structured Data for Contact */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(structuredData, null, 0) 
        }}
        suppressHydrationWarning={true}
      />
      <ContactClient />
    </>
  );
}
