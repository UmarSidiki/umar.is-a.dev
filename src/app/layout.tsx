import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import CustomCursor from "@/components/CustomCursor";
import { seoConfig } from "@/lib/seo"; // Import SEO config
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
  metadataBase: new URL(seoConfig.siteUrl), // Use site URL from config
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.author.name, url: seoConfig.siteUrl }],
  creator: seoConfig.author.name,
  publisher: seoConfig.author.name,
  category: "technology",
  classification: "Portfolio Website",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: seoConfig.ogImage.url,
        width: seoConfig.ogImage.width,
        height: seoConfig.ogImage.height,
        alt: seoConfig.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: seoConfig.author.twitter,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [seoConfig.ogImage.url],
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
    canonical: seoConfig.siteUrl,
    languages: {
      'en-US': seoConfig.siteUrl,
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
