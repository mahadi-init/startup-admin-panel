"use client";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { useSidebar } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const { state } = useSidebar();
  const isOpen = state === "expanded";

  return (
    <header
      className={`sticky ${isOpen ? "ml-64" : "ml-8"} top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6`}
    >
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <form className="hidden flex-1 md:block md:max-w-sm lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
