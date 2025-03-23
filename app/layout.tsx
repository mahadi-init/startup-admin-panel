import type React from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Meta } from "@/components/meta"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
