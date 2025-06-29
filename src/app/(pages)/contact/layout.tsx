import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Get In Touch",
  description: "Ready to start your next project? Get in touch with Umar Siddiqui, an experienced full-stack developer. Available for freelance projects, consultations, and full-time opportunities.",
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
    "Technical Consulting"
  ],
  openGraph: {
    title: "Contact Umar Siddiqui - Full-Stack Developer",
    description: "Ready to start your next project? Get in touch for web development services and technical consultation.",
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
    description: "Ready to start your next project? Get in touch for web development services.",
  },
  alternates: {
    canonical: "https://umarsiddiqui.dev/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for Contact */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Umar Siddiqui",
            description: "Get in touch with Umar Siddiqui for web development services and technical consultation",
            url: "https://umarsiddiqui.dev/contact",
            mainEntity: {
              "@type": "Person",
              name: "Umar Siddiqui",
              jobTitle: "Full-Stack Developer",
              email: "siddiquiumar0007@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "H# A1408/191, Old Sukkur",
                addressLocality: "Sukkur",
                addressRegion: "Sindh",
                addressCountry: "Pakistan"
              },
              offers: {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Web Development Services",
                  description: "Full-stack web development, React/Next.js applications, and technical consulting"
                }
              }
            }
          })
        }}
      />
      {children}
    </>
  );
}
