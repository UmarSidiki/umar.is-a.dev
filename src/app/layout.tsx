import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import CustomCursor from "@/components/CustomCursor";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import "@/styles/app.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://umarsiddiqui.dev'), // Replace with your actual domain
  title: {
    default: "Umar Siddiqui - Full-Stack Developer | React, Next.js, Node.js Expert",
    template: "%s | Umar Siddiqui - Full-Stack Developer"
  },
  description:
    "Professional portfolio of Umar Siddiqui, an experienced full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies. Creating innovative digital solutions and scalable web applications.",
  keywords: [
    "Full-Stack Developer",
    "React Developer", 
    "Next.js Expert",
    "TypeScript Developer",
    "Node.js Developer",
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "JavaScript Expert",
    "Modern Web Technologies",
    "Responsive Design",
    "API Development",
    "Database Design",
    "Cloud Computing",
    "Software Engineer",
    "Umar Siddiqui"
  ],
  authors: [{ name: "Umar Siddiqui", url: "https://umarsiddiqui.dev" }],
  creator: "Umar Siddiqui",
  publisher: "Umar Siddiqui",
  category: "technology",
  classification: "Portfolio Website",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://umarsiddiqui.dev",
    siteName: "Umar Siddiqui - Full-Stack Developer",
    title: "Umar Siddiqui - Full-Stack Developer | React, Next.js, Node.js Expert",
    description: "Professional portfolio showcasing innovative web solutions and modern development expertise. Specializing in React, Next.js, TypeScript, and scalable web applications.",
    images: [
      {
        url: "/api/og", // We'll create this OG image endpoint
        width: 1200,
        height: 630,
        alt: "Umar Siddiqui - Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@umarsiddiqui", // Replace with your Twitter handle
    title: "Umar Siddiqui - Full-Stack Developer | React, Next.js Expert",
    description: "Professional portfolio showcasing innovative web solutions and modern development expertise.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Add your Google Search Console verification
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://umarsiddiqui.dev",
    languages: {
      'en-US': 'https://umarsiddiqui.dev',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
};

// Viewport configuration for optimal mobile experience
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
    { media: '(prefers-color-scheme: dark)', color: '#d97706' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Universal Background with subtle pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-amber to-amber-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 z-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(163_163_163_/_15%)_1px,_transparent_0)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,_rgb(255_255_255_/_15%)_1px,_transparent_0)]"></div>
            </div>
            
            <Header />
              {children}
            <CustomCursor />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
