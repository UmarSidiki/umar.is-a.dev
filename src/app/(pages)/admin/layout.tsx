import { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { generateCompletePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generateCompletePageMetadata({
  pageKey: 'admin',
  url: '/admin'
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
