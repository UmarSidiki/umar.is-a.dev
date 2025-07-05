import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import CustomCursor from "@/components/CustomCursor";
import { generateCompletePageMetadata, generateStructuredData, seoConfig } from "@/lib/seo";
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
  metadataBase: new URL(seoConfig.siteUrl),
  ...generateCompletePageMetadata({ pageKey: 'home' }),
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
  // Generate structured data for the website
  const websiteStructuredData = generateStructuredData("website");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(websiteStructuredData, null, 0) 
          }}
          suppressHydrationWarning={true}
        />
      </head>
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
