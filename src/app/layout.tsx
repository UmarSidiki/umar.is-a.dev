import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Header from "@/components/Header/Header";
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
  title: "Umar Siddiqui - Full-Stack Developer",
  description:
    "Professional portfolio of Umar Siddiqui, a full-stack developer passionate about creating innovative web solutions and digital experiences.",
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
          {/* Universal Background with subtle pattern */}
          <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-amber to-amber-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(163_163_163_/_15%)_1px,_transparent_0)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,_rgb(255_255_255_/_15%)_1px,_transparent_0)]"></div>
          </div>
          
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
