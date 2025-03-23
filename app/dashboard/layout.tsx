"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DataProvider } from "@/contexts/data-context"
import { ToastProvider } from "@/components/ui/toast-provider"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ToastProvider>
        <DataProvider>
          <SidebarProvider>
            <div className="flex min-h-screen flex-col">
              <DashboardHeader />
              <div className="flex flex-1">
                <DashboardSidebar />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                  <Suspense fallback={<LoadingSpinner size="lg" />}>{children}</Suspense>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

