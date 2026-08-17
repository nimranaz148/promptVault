"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingGate } from "@/components/OnboardingGate";
import { UserMenu } from "@/components/UserMenu";
import { Search, Settings, Grid, Image as ImageIcon, Video, FileText, Plus, Bell } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "All Prompts", value: "", icon: Grid },
  { label: "Images", value: "image", icon: ImageIcon },
  { label: "Videos", value: "video", icon: Video },
  { label: "Text", value: "text", icon: FileText },
];

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="w-64 shrink-0">
          <Link href="/app" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-primary">PromptVault</span>
          </Link>
        </div>

        <div className="flex-1 max-w-2xl px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-9 bg-muted/30 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-border"
            />
          </div>
        </div>
        <div className="w-64 shrink-0 flex justify-end items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => toast.info("No new notifications yet.")}
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/50 bg-card flex flex-col hidden md:flex">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {NAV_LINKS.map(({ label, value, icon: Icon }) => {
              const isActive = activeType === value;
              const href = value ? `/app?type=${value}` : "/app";
              return (
                <Link
                  key={value}
                  href={href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border/50">
            <Button asChild className="w-full justify-start space-x-2 font-semibold shadow-sm h-11">
              <Link href="/app/cards/new">
                <Plus className="w-5 h-5 mr-1" />
                New Prompt
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          <OnboardingGate>{children}</OnboardingGate>
        </main>
      </div>
    </div>
  );
}


