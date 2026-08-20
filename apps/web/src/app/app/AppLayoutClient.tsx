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

import { useFolders } from "@/hooks/useFolders";
import { Folder as FolderIcon, Trash2 } from "lucide-react";
import { useState } from "react";

function SidebarFolders({ activeFolder }: { activeFolder: string | null }) {
  const { folders, createFolder, deleteFolder } = useFolders();
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder.mutateAsync(newFolderName.trim());
      setNewFolderName("");
      setIsCreating(false);
      toast.success("Folder created");
    } catch {
      toast.error("Failed to create folder");
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete folder "${name}"? Cards inside won't be deleted.`)) {
      try {
        await deleteFolder.mutateAsync(id);
        toast.success("Folder deleted");
      } catch {
        toast.error("Failed to delete folder");
      }
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between px-3 mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Folders</h4>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="px-3 mb-3">
          <Input
            autoFocus
            size={1}
            placeholder="Folder name..."
            className="h-8 text-sm"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={() => !newFolderName.trim() && setIsCreating(false)}
          />
        </form>
      )}

      <div className="space-y-1">
        {folders?.map((folder) => {
          const isActive = activeFolder === folder.id;
          return (
            <Link
              key={folder.id}
              href={`/app?folder=${folder.id}`}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <FolderIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{folder.name}</span>
              </div>
              <button
                onClick={(e) => handleDelete(folder.id, folder.name, e)}
                className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Link>
          );
        })}
        {folders?.length === 0 && !isCreating && (
          <div className="px-3 py-2 text-sm text-muted-foreground italic">No folders yet</div>
        )}
      </div>
    </div>
  );
}

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
        <aside className="w-64 border-r border-border/50 bg-card flex flex-col hidden md:flex overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {NAV_LINKS.map(({ label, value, icon: Icon }) => {
              const isActive = activeType === value && !searchParams.get("folder");
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
            
            <SidebarFolders activeFolder={searchParams.get("folder")} />
          </nav>
          <div className="p-4 border-t border-border/50 shrink-0">
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


