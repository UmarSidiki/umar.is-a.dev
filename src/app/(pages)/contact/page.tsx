import { Metadata } from "next";
import { generateCompletePageMetadata, generateStructuredData } from "@/lib/seo";
import ContactClient from "./ContactClient";

export const metadata: Metadata = generateCompletePageMetadata({ 
  pageKey: 'contact',
  url: '/contact'
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
