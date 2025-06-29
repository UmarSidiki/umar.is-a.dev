import { Metadata } from "next";
import { generateStructuredData } from "@/lib/seo";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact - Get In Touch",
  description:
    "Ready to start your next project? Get in touch with Umar Siddiqui, an experienced full-stack developer. Available for freelance projects, consultations, and full-time opportunities.",
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
  openGraph: {
    title: "Contact Umar Siddiqui - Full-Stack Developer",
    description:
      "Ready to start your next project? Get in touch for web development services and technical consultation.",
    type: "website",
    images: [
      {
        url: "/api/og?title=Contact&subtitle=Ready to start your next project?&type=contact",
        width: 1200,
        height: 630,
        alt: "Contact Umar Siddiqui",
      },
    ],
  },
  twitter: {
    title: "Contact Umar Siddiqui - Full-Stack Developer",
    description:
      "Ready to start your next project? Get in touch for web development services.",
  },
  alternates: {
    canonical: `${process.env.SITE_URL || "https://umarsiddiqui.dev"}/contact`,
  },
};

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
