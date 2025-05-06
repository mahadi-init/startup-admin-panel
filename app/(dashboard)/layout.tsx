"use client";

import type React from "react";
import { Suspense } from "react";
import { DataProvider } from "@/contexts/data-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ToastProvider } from "@/components/ui/toast-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <DataProvider>
        <SidebarProvider>
          <div className="flex min-h-screen flex-col w-full">
            <DashboardHeader />
            <div className="flex flex-1">
              <DashboardSidebar />
              <main className="flex-1 overflow-auto p-4 md:p-6">
                <Suspense fallback={<LoadingSpinner size="lg" />}>
                  {children}
                </Suspense>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </DataProvider>
    </ToastProvider>
  );
}
