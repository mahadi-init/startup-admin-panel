import "./globals.css";
import type React from "react";
import { Meta } from "@/components/meta";
import { ErrorBoundary } from "@/components/error-boundary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  icons: ["/favicon.png"],
  description: "Admin panel for startup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Meta
        title="Admin Panel | Dashboard"
        description="Powerful admin panel for managing your business"
        keywords="admin, dashboard, management, business"
      />
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
